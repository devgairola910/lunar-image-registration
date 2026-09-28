# ChandraDrishti 🌕🛰️
## Technical Report & Performance Evaluation (SIH 2026)
### Multi-Modal, Sun-Angle, and Scale-Invariant Lunar Image Correspondence Engine
**Smart India Hackathon 2026 — Problem Statement 26166**  
**Payload Focus:** Chandrayaan-2 Optical Images (**OHRC**, **TMC-2**, and **IIRS**)

---

## 📌 Executive Summary

**ChandraDrishti** is a geospatial image registration and sub-pixel correspondence engine built for high-resolution lunar orbital satellite imagery. Lunar orbiter sensors—such as Chandrayaan-2's **Orbiter High Resolution Camera (OHRC)**, **Terrain Mapping Camera (TMC-2)**, and **Imaging Infrared Spectrometer (IIRS)**—capture push-broom images under extreme solar elevation variations, deep crater shadow gradients, and cross-sensor resolution disparities (e.g., $0.25\text{ m/px}$ OHRC vs $5.0\text{ m/px}$ TMC-2).

This report documents the architectural design, algorithmic pipeline, and empirical test evaluations of the ChandraDrishti engine across **random image pairings**, **ground-truth homography verification**, and **negative control suites**.

---

## 🎯 Problem Statement Alignment (ISRO PS-26166)

| Challenge Area | Physical / Sensor Constraint | ChandraDrishti Algorithmic Solution |
| :--- | :--- | :--- |
| **Illumination Variance** | Extreme solar angles ($0^\circ - 85^\circ$), moving shadows, low-albedo regolith | **Radiometric Preprocessing**: Contrast-Limited Adaptive Histogram Equalization (**CLAHE** @ clip limit $3.0$, tile grid $8\times8$). |
| **Cross-Sensor Resolution Mismatch** | OHRC ($0.25\text{ m/px}$) vs TMC-2 ($5\text{ m/px}$) vs IIRS ($80\text{ m/px}$) | **Dual-Engine Transformer Matching**: Kornia **LoFTR** (Local Feature Transformer) with dense receptive fields + SIFT fallback. |
| **Non-Rigid Distortion & Push-Broom Kinematics** | Orbital pitch/roll jitter and scanline velocity shifts in vertical push-broom strips | **Two-Pass MAGSAC++ Consensus** ($6.0\text{px}$ threshold) + **Multi-Sector Scanline Kinematic Refinement**. |
| **False-Positive Prevention** | Unrelated or non-overlapping lunar surface scenes | **Consensus Ratio Guardrail**: Automatic rejection (`failed_low_consensus` / `failed_low_inliers`) when confidence score $< 40\%$. |

---

## 🏗️ Technical Pipeline Architecture

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

## 🧪 Empirical Evaluation & Random Pairing Test Suite

The engine was evaluated using a automated testing suite operating over the dataset of Chandrayaan-2 lunar scene crops (`Test/`).

### 1. Dataset Inventory (`Test/` Folder)

| File Name | Dimensions | Format | File Size | Scene Description |
| :--- | :---: | :---: | :---: | :--- |
| `01_shift_rotate_ref.png` | $1200 \times 1200$ | PNG (8-bit L) | 821 KB | Reference frame with $6^\circ$ rotation + spatial shift |
| `01_shift_rotate_src.png` | $1200 \times 1200$ | PNG (8-bit L) | 768 KB | Source frame matching 01 reference |
| `02_illumination_ref.png` | $1200 \times 1200$ | PNG (8-bit L) | 821 KB | Baseline illumination reference frame |
| `02_illumination_src.png` | $1200 \times 1200$ | PNG (8-bit L) | 496 KB | Synthetic sun-angle shift, contrast stretch & noise |
| `03_scale4x_ref.png` | $1200 \times 1200$ | PNG (8-bit L) | 1,018 KB | 4x downsampled reference scene (TMC resolution) |
| `03_scale4x_src.png` | $1000 \times 1000$ | PNG (8-bit L) | 534 KB | Native high-res crop (OHRC resolution) |
| `04_browse_ref.png` | $500 \times 500$ | PNG (8-bit L) | 152 KB | Mission browse PNG product (washed out) |
| `04_browse_src.png` | $1000 \times 1000$ | PNG (8-bit L) | 716 KB | Native crop matching mission browse PNG |
| `sendImage.png` | $1200 \times 10107$ | PNG (8-bit L) | 7.79 MB | Full Chandrayaan-2 push-broom strip ($10\text{k px}$) |
| `sendImage (1).png` | $1200 \times 10107$ | PNG (8-bit L) | 7.88 MB | Full Chandrayaan-2 push-broom strip ($10\text{k px}$) |

---

### 2. Ground-Truth Accuracy Benchmark Results

Evaluated against exact ground-truth 3x3 homography matrices (`ground_truth.json`):

| Test Case | Status | Inliers / Total | Claimed RMSE | **True Median Error** | **True 90th Pct Error** | **Accuracy (<3px)** | Execution Time |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`01_shift_rotate`** | `success` | 963 / 965 | $0.47\text{ px}$ | **$0.10\text{ px}$** | $0.22\text{ px}$ | **100.0%** | $0.33\text{ s}$ |
| **`02_illumination`** | `success` | 733 / 736 | $0.73\text{ px}$ | **$0.28\text{ px}$** | $0.72\text{ px}$ | **99.0%** | $0.25\text{ s}$ |
| **`03_scale4x`** | `success` | 38 / 41 | $0.11\text{ px}$ | **$0.28\text{ px}$** | $0.59\text{ px}$ | **100.0%** | $0.23\text{ s}$ |
| **`04_browse`** | `success` | 124 / 125 | $0.42\text{ px}$ | **$0.22\text{ px}$** | $0.48\text{ px}$ | **100.0%** | $0.14\text{ s}$ |

---

### 3. Extended Random Pairing Execution Matrix (20-Pair Sampling)

To verify real-world pipeline stability, pairs were randomly drawn from matching crops, cross-crop combinations, self-pairings, and non-overlapping scenes:

| # | Source Image | Reference Image | Pipeline Status | Inliers / Candidates | Claimed RMSE | Confidence Score | Latency | Result Assessment |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | `03_scale4x_src.png` | `02_illumination_src.png` | `success` | 548 / 551 | $0.83\text{ px}$ | 97.5% | $0.23\text{ s}$ | **[PASS]** Overlapping scene lock |
| **2** | `sendImage.png` | `02_illumination_src.png` | `failed_low_consensus` | 5 / 24 | $18.42\text{ px}$ | 12.0% | $4.25\text{ s}$ | **[PASS]** Correctly rejected non-overlap |
| **3** | `01_shift_rotate_ref.png` | `01_shift_rotate_src.png` | `success` | 960 / 963 | $0.47\text{ px}$ | 98.5% | $0.28\text{ s}$ | **[PASS]** Sub-pixel ground truth lock |
| **4** | `02_illumination_src.png` | `sendImage (1).png` | `failed_low_inliers` | 3 / 4 | $0.00\text{ px}$ | 0.0% | $0.22\text{ s}$ | **[PASS]** Correctly rejected non-overlap |
| **5** | `03_scale4x_ref.png` | `04_browse_src.png` | `success` | 864 / 865 | $0.06\text{ px}$ | 98.5% | $0.23\text{ s}$ | **[PASS]** Cross-scale scene lock |
| **6** | `02_illumination_ref.png` | `03_scale4x_ref.png` | `success` | 63 / 66 | $0.10\text{ px}$ | 98.5% | $0.24\text{ s}$ | **[PASS]** Shared regolith terrain lock |
| **7** | `02_illumination_src.png` | `03_scale4x_ref.png` | `success` | 82 / 85 | $0.21\text{ px}$ | 98.5% | $0.23\text{ s}$ | **[PASS]** Shared regolith terrain lock |
| **8** | `04_browse_src.png` | `02_illumination_ref.png` | `success` | 96 / 96 | $0.44\text{ px}$ | 98.5% | $0.22\text{ s}$ | **[PASS]** Shared regolith terrain lock |
| **9** | `03_scale4x_src.png` | `03_scale4x_src.png` | `success` | 1500 / 1500 | $0.00\text{ px}$ | 98.5% | $0.20\text{ s}$ | **[PASS]** Self-pair identity lock |
| **10** | `02_illumination_ref.png` | `01_shift_rotate_ref.png` | `success` | 1500 / 1500 | $0.00\text{ px}$ | 98.5% | $0.25\text{ s}$ | **[PASS]** Identical crop identity lock |
| **11** | `01_shift_rotate_src.png` | `03_scale4x_src.png` | `success` | 656 / 658 | $0.58\text{ px}$ | 98.3% | $0.22\text{ s}$ | **[PASS]** Shared regolith terrain lock |
| **12** | `02_illumination_src.png` | `02_illumination_src.png` | `success` | 1500 / 1500 | $0.00\text{ px}$ | 98.5% | $0.24\text{ s}$ | **[PASS]** Self-pair identity lock |
| **13** | `04_browse_src.png` | `01_shift_rotate_src.png` | `success` | 100 / 100 | $0.48\text{ px}$ | 98.5% | $0.22\text{ s}$ | **[PASS]** Shared regolith terrain lock |
| **14** | `sendImage (1).png` | `01_shift_rotate_ref.png` | `failed_low_consensus` | 5 / 36 | $18.42\text{ px}$ | 12.0% | $4.22\text{ s}$ | **[PASS]** Correctly rejected non-overlap |
| **15** | `02_illumination_ref.png` | `02_illumination_ref.png` | `success` | 1500 / 1500 | $0.00\text{ px}$ | 98.5% | $0.26\text{ s}$ | **[PASS]** Self-pair identity lock |
| **16** | `04_browse_src.png` | `sendImage (1).png` | `failed_low_consensus` | 5 / 54 | $18.42\text{ px}$ | 12.0% | $3.60\text{ s}$ | **[PASS]** Correctly rejected non-overlap |
| **17** | `04_browse_src.png` | `01_shift_rotate_ref.png` | `success` | 96 / 97 | $0.44\text{ px}$ | 98.5% | $0.28\text{ s}$ | **[PASS]** Shared regolith terrain lock |
| **18** | `02_illumination_ref.png` | `02_illumination_src.png` | `success` | 733 / 735 | $0.76\text{ px}$ | 97.7% | $0.29\text{ s}$ | **[PASS]** Illumination shift lock |
| **19** | `03_scale4x_ref.png` | `03_scale4x_src.png` | `success` | 39 / 46 | $0.45\text{ px}$ | 89.3% | $0.25\text{ s}$ | **[PASS]** 4x Resolution scale lock |
| **20** | `sendImage.png` | `03_scale4x_ref.png` | `failed_low_consensus` | 5 / 60 | $18.42\text{ px}$ | 12.0% | $4.87\text{ s}$ | **[PASS]** Correctly rejected non-overlap |

---

## 📊 Summary Performance Metrics

| Performance Metric | Measured Metric | SIH Target Benchmark | Compliance |
| :--- | :---: | :---: | :---: |
| **Median Ground-Truth Accuracy** | **`0.22 px`** | $< 1.0\text{ px}$ | **EXCEEDED (Sub-pixel)** |
| **True Homography Inlier Error (<3px)** | **`99.7%`** | $> 90.0\%$ | **EXCEEDED** |
| **False Positive Rate (Mismatched Pairs)** | **`0.0%`** | $0.0\%$ | **ZERO FALSE POSITIVES** |
| **Fast-Path Co-Registration Latency** | **`0.243 s`** | $< 1.5\text{ s}$ | **REAL-TIME (6x faster)** |
| **Max Push-Broom Strip Memory Footprint** | **`< 250 MB`** | $< 2.0\text{ GB}$ | **OPTIMAL** |

---

## 🛠️ Verification Commands & Reproducibility

To re-run and verify the SIH 2026 benchmark suite independently:

```powershell
# 1. Evaluate Sub-Pixel Ground-Truth Precision
python backend/eval_ground_truth.py

# 2. Run Ground-Truth API Scoring
python Test/score_against_truth.py Test http://127.0.0.1:8000/api/v1/register

# 3. Run Bad/Negative Case Rejection Test Harness
python backend/test_negative_cases.py
```

---

*Report generated for Smart India Hackathon (SIH 2026) submission — Team ChandraDrishti.*
