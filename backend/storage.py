import os
import logging
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("chandradrishti.storage")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "lunar-images")

_supabase_client = None

def get_supabase():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.info("Supabase credentials missing in .env - operating in local in-memory fallback mode.")
        return None
    try:
        from supabase import create_client
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
        return _supabase_client
    except Exception as e:
        logger.warning(f"Failed to initialize Supabase client: {e}. Falling back to in-memory mode.")
        return None

def upload_image_if_configured(file_bytes: bytes, filename: str, folder: str = "uploads") -> Optional[str]:
    """Uploads file to Supabase Storage bucket if configured, returns public URL or path."""
    client = get_supabase()
    if not client:
        return None
    try:
        path = f"{folder}/{filename}"
        res = client.storage.from_(STORAGE_BUCKET).upload(path, file_bytes, file_options={"upsert": "true"})
        public_url = client.storage.from_(STORAGE_BUCKET).get_public_url(path)
        return public_url
    except Exception as e:
        logger.warning(f"Supabase storage upload failed for {filename}: {e}")
        return None

def log_metrics_if_configured(run_id: str, metrics: Dict[str, Any], source_info: Dict[str, Any], ref_info: Dict[str, Any]) -> bool:
    """Logs registration run metrics to Supabase PostgreSQL table if configured."""
    client = get_supabase()
    if not client:
        return False
    try:
        data = {
            "run_id": run_id,
            "inlier_count": metrics.get("inlier_count", 0),
            "inlier_ratio": metrics.get("inlier_ratio", 0.0),
            "rmse": metrics.get("rmse", 0.0),
            "confidence_score": metrics.get("confidence_score", 0.0),
            "source_sensor": source_info.get("sensor", "UNKNOWN"),
            "reference_sensor": ref_info.get("sensor", "UNKNOWN"),
            "homography": metrics.get("homography_matrix"),
            "created_at": "now()"
        }
        client.table("registration_logs").insert(data).execute()
        logger.info(f"Successfully logged metrics for run {run_id} to Supabase database.")
        return True
    except Exception as e:
        logger.warning(f"Supabase DB log metrics failed: {e}")
        return False
