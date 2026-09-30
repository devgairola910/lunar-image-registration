import os
import time
import uuid
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional

from schemas import RegistrationResponse, RegistrationMetrics
from pipeline import run_registration_pipeline, get_loftr_model
from storage import upload_image_if_configured, log_metrics_if_configured

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chandradrishti.api")

os.makedirs("backend/outputs", exist_ok=True)

app = FastAPI(
    title="ChandraDrishti Backend API",
    description="Multi-modal, Sun angle and scale invariant image correspondence using Chandrayaan-2 optical images (OHRC, TMC, IIRS)",
    version="1.0.0"
)

# Enable CORS for local React development and any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/outputs", StaticFiles(directory="backend/outputs"), name="outputs")


@app.on_event("startup")
def startup_event():
    logger.info("Pre-warming AI feature matching models on startup...")
    get_loftr_model()
    logger.info("AI models successfully loaded into memory.")


@app.get("/")
def read_root():
    return {
        "service": "ChandraDrishti API",
        "status": "operational",
        "version": "1.0.0",
        "endpoint": "/api/v1/register"
    }


@app.get("/api/v1/health")
def health_check():
    loftr = get_loftr_model()
    return {
        "status": "healthy",
        "loftr_available": loftr is not None,
        "timestamp": time.time()
    }


@app.post("/api/v1/register", response_model=RegistrationResponse)
async def register_images(
    source_image: UploadFile = File(..., description="Source lunar frame (OHRC, TMC, or IIRS)"),
    reference_image: UploadFile = File(..., description="Reference baseline frame"),
    source_sensor: Optional[str] = Form("CH2_OHRC"),
    reference_sensor: Optional[str] = Form("CH2_TMC"),
    mode: Optional[str] = Form("fast", description="Processing mode: fast (global downscaled preview) | native (sliding window tiling)"),
    transform_type: Optional[str] = Form("tps", description="Geometric transform: tps | affine")
):
    """
    Core Image Co-Registration API Endpoint.
    
    Ingests source and reference image files, executes the LoFTR + MAGSAC++ 
    feature matching pipeline with Thin Plate Spline (TPS) warping, dynamic telemetry,
    and GeoTIFF generation.
    """
    logger.info(f"Received registration request: source={source_image.filename}, reference={reference_image.filename}, mode={mode}, transform={transform_type}")
    
    # Read uploaded file bytes
    try:
        source_bytes = await source_image.read()
        reference_bytes = await reference_image.read()
    except Exception as e:
        logger.error(f"Error reading uploaded image files: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid or corrupted image files uploaded: {str(e)}")
        
    if len(source_bytes) == 0 or len(reference_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded source or reference image file is empty.")

    run_id = f"RUN-{uuid.uuid4().hex[:8].upper()}"
    
    # Storage upload if Supabase is configured
    upload_image_if_configured(source_bytes, f"{run_id}_src.png")
    upload_image_if_configured(reference_bytes, f"{run_id}_ref.png")
    
    # Execute AI Matching & TPS Registration Pipeline
    result = run_registration_pipeline(source_bytes, reference_bytes, mode=mode or "fast", transform_type=transform_type or "tps")
    
    # Log metrics to Supabase PostgreSQL if configured
    source_info = {"sensor": source_sensor, "filename": source_image.filename}
    ref_info = {"sensor": reference_sensor, "filename": reference_image.filename}
    log_metrics_if_configured(run_id, result.get("metrics", {}), source_info, ref_info)
    
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
