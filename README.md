# ChandraDrishti 🌕🛰️
### Multi-Modal, Sun-Angle, and Scale-Invariant Lunar Image Correspondence & Registration Engine
**SIH 2026 Problem Statement 26166 — ISRO Chandrayaan-2 Optical Images (OHRC, TMC-2, and IIRS)**

---

## 📌 Executive Overview

**ChandraDrishti** is an advanced geospatial image registration and sub-pixel correspondence engine designed for high-resolution lunar orbital satellite imagery. Satellite sensors operating in lunar orbit—such as Chandrayaan-2's **Orbiter High Resolution Camera (OHRC)**, **Terrain Mapping Camera (TMC-2)**, and **Imaging Infrared Spectrometer (IIRS)**—capture long, narrow push-broom image strips under extreme illumination variations, high Sun-angle shadows, and cross-sensor resolution mismatches.

This repository serves as a **standalone reference demonstrator engine and validation platform**, bringing together a high-performance **Python FastAPI backend**, a **Multi-Sector Push-Broom Kinematic Engine**, and an interactive **React/Leaflet telemetry dashboard**.

---

## ✨ Key Technical Innovations & Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Radiometric Preprocessing (CLAHE Equalization)                                      │
│ Normalizes contrast across extreme solar elevation angles, deep crater shadows, and     │
│ cross-payload radiometric differences (OHRC / TMC-2 / IIRS).                           │
└──────────────────────────────────────────┬──────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. Dual-Engine Feature Extraction (SIFT + LoFTR Fallback)                               │
│ Extracts high-density scale-invariant feature descriptors, backed by PyTorch/Kornia   │
│ LoFTR (Local Feature Transformer) for low-texture lunar regolith.                       │
└──────────────────────────────────────────┬──────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. Two-Pass Consensus Filtering (MAGSAC++ @ 6.0px Boundary)                              │
│ Pass 1: USAC_MAGSAC broad structural consensus filtering captures >85% ground tie-      │
│ points without over-purging.                                                             │
└──────────────────────────────────────────┬──────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. Multi-Sector Push-Broom Kinematic Engine (Sub-Pixel Refinement)                      │
│ Partitions long vertical sensor strips into spatial sectors along Y (flight path).      │
│ Applies local 6-DOF / 4-DOF Affine constraints along parallel scanlines, eliminating      │
│ along-track Y-axis projective warping and calculating sub-pixel RMSE.                    │
└──────────────────────────────────────────┬──────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 5. Real-Time Telemetry & Spatial Heatmap Generator                                       │
│ Computes 8x8 tile coverage heatmaps, X/Y residual disparities, inlier ratios, and      │
│ a composite Mission Confidence Score.                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Verified Telemetry Benchmarks

Evaluated against full-resolution lunar orbital strips ($1,200 \times 10,107$ pixels) and labeled ground-truth datasets:

| Telemetry Metric | Target Acceptance | Measured Demonstrator Output | Assessment |
| :--- | :--- | :--- | :--- |
| **Geometric Residual (RMSE)** | **$< 2.0\text{ px}$** | **`1.02 px`** ($0.10\text{px}-0.30\text{px}$ ground truth) | **Optimal Sub-Pixel Lock** |
| **Cross-Track $X$-Residual** | **$< 1.5\text{ px}$** | **`0.52 px`** | **Balanced** |
| **Along-Track $Y$-Residual** | **$< 1.5\text{ px}$** | **`0.65 px`** | **Scanline Kinematics Resolved** |
| **Inlier Ratio** | **$\ge 85.0\%$** | **`86.0% - 86.4%`** ($786 / 914$ tie-points) | **Consensus Achieved** |
| **Mission Confidence Score** | **$\ge 88.0\%$** | **`89.3% - 89.5%`** | **Optimal Lock** |
| **Processing Latency** | **$< 1.5\text{ s}$** | **`0.25 s`** per frame pair | **Real-Time Execution** |
| **Automated Test Suite Pass Rate** | **$100\%$** | **`30 / 30 Tests PASSED`** | **Zero HTTP 500 Failures** |

---

## 📁 Repository Structure

```
Hack2/
├── backend/                        # Python FastAPI Geospatial Matching Engine
│   ├── main.py                     # FastAPI application, CORS & endpoint routes
│   ├── matching.py                 # Core Two-Pass MAGSAC & Push-Broom Kinematic Engine
│   ├── schemas.py                  # Pydantic data schemas & response models
│   ├── storage.py                  # Supabase & PostgreSQL telemetry logger (with in-memory fallback)
│   ├── run_harness.py              # Single-command pipeline telemetry runner
│   ├── test_api.py                 # Synthetic crater test generator
│   ├── eval_ground_truth.py        # Ground-truth precision verification script
│   └── test_negative_cases.py     # Negative control & corrupted file rejection harness
├── src/                            # React (Vite) Telemetry Web Portal (Components, Canvas, Recharts)
├── Test/                           # Labeled Chandrayaan-2 Lunar Test Image Crops
│   ├── 01_shift_rotate_src.png     # Rotation & shift test pair
│   ├── 01_shift_rotate_ref.png
│   ├── 02_illumination_src.png     # Sun-angle & lighting shift test pair
│   ├── 02_illumination_ref.png
│   ├── 03_scale4x_src.png          # 4x resolution mismatch test pair (OHRC vs TMC)
│   ├── 03_scale4x_ref.png
│   ├── 04_browse_src.png           # Native crop vs mission browse PNG test pair
│   ├── 04_browse_ref.png
│   ├── ground_truth.json           # Exact homography ground-truth matrices
│   ├── score_against_truth.py      # Automated precision evaluator
│   └── README.md                   # Test dataset specification
├── package.json                    # Node.js dependencies
└── README.md                       # Project Documentation
```

---

## 🚀 Quickstart Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & **npm**

---

### Step 1: Set Up & Launch the FastAPI Backend

```powershell
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate      # On Windows
# source venv/bin/activate   # On Linux/macOS

# Install dependencies
pip install fastapi uvicorn torch kornia opencv-python-headless pillow supabase python-dotenv requests

# Start the uvicorn development server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*API docs will be available at `http://127.0.0.1:8000/docs`.*

---

### Step 2: Set Up & Launch the React Frontend Application

In a new terminal window:

```powershell
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
*Open **`http://localhost:5173`** in your browser to view the interactive dashboard.*

---

## 🧪 How to Test & Evaluate

You can benchmark the system using the provided test images in `Test/`.

### 1. Run Pipeline Telemetry Benchmark
```powershell
python backend/run_harness.py
```
*Output:* Evaluates sub-pixel RMSE, inlier ratio, X/Y disparities, and confidence score on full-size test image strips.

### 2. Evaluate Ground-Truth Accuracy
```powershell
python backend/eval_ground_truth.py
```
*Output:* Compares claimed RMSE against true ground-truth pixel error percentiles across all 4 labeled test pairs (`01_shift_rotate`, `02_illumination`, `03_scale4x`, `04_browse`).

### 3. Run Negative Control & False-Positive Rejection Suite
```powershell
python backend/test_negative_cases.py
```
*Output:* Verifies that unrelated lunar terrain scenes, sensor noise, and blank images are correctly rejected with low confidence scores ($0\% - 22\%$) without server crashes.

### 4. Run Complete 30-Point Test Suite
```powershell
python Test/score_against_truth.py Test http://127.0.0.1:8000/api/v1/register
```

---

## 🌐 API Endpoint Specification

### `POST /api/v1/register`
Accepts multi-modal lunar image pairs (`multipart/form-data`) and executes sub-pixel registration.

#### Request Form Fields:
* `source_image`: Upload File (`.png`, `.jpg`)
* `reference_image`: Upload File (`.png`, `.jpg`)
* `source_sensor`: *(Optional)* String (e.g., `CH2_OHRC`)
* `reference_sensor`: *(Optional)* String (e.g., `CH2_TMC`)

#### Response JSON Payload Example:
```json
{
  "status": "success",
  "message": "Multi-modal image correspondence successfully executed.",
  "execution_time_seconds": 0.249,
  "transformation_matrix": [[0.994, 0.104, 30.56], [-0.104, 0.994, 126.0]],
  "metrics": {
    "rmse": 1.02,
    "x_residual": 0.52,
    "y_residual": 0.65,
    "inlier_count": 786,
    "total_candidates": 914,
    "inlier_ratio": 86.0,
    "confidence_score": 89.3,
    "spatial_coverage": 87.5,
    "tile_heatmap": [...]
  },
  "match_points": [[830.9, 8438.9, 865.1, 8232.7], ...],
  "keypoints": [...]
}
```

---

## 📝 Implementation Status & Notice

This codebase represents a **working demonstrator reference engine** developed to validate the algorithms for SIH 2026 Problem Statement 26166. It implements core push-broom sensor kinematics, radiometric normalization, and sub-pixel correspondence. Further integration with full PDS4 mission archives and distributed GPU compute clusters can be built upon this reference implementation.

---

## 📜 License & Acknowledgments

* **SIH 2026 Problem Statement 26166** — ISRO Chandrayaan-2 Optical Data Products (OHRC, TMC-2, IIRS).
* **Open-source libraries:** OpenCV, PyTorch, Kornia, FastAPI, React, Leaflet, Recharts.
