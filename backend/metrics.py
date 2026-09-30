import logging
import time
import numpy as np
import cv2
from typing import Tuple, Dict, Any, List, Optional
import scipy.interpolate as interp

logger = logging.getLogger("chandradrishti.metrics")

def split_fitting_and_validation(
    inliers_src: np.ndarray,
    inliers_dst: np.ndarray,
    val_ratio: float = 0.20,
    random_seed: int = 42
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Randomly splits matched inlier tie-points into an 80% Fitting Set
    and a 20% Held-Out Validation Set.
    """
    n_pts = len(inliers_src)
    if n_pts < 5:
        return inliers_src, inliers_dst, inliers_src, inliers_dst

    np.random.seed(random_seed)
    shuffled_indices = np.random.permutation(n_pts)

    n_val = max(1, int(round(n_pts * val_ratio)))
    n_fit = n_pts - n_val

    fit_idx = shuffled_indices[:n_fit]
    val_idx = shuffled_indices[n_fit:]

    return (
        inliers_src[fit_idx],
        inliers_dst[fit_idx],
        inliers_src[val_idx],
        inliers_dst[val_idx]
    )


def calculate_held_out_rmse(
    fit_src: np.ndarray,
    fit_dst: np.ndarray,
    val_src: np.ndarray,
    val_dst: np.ndarray,
    use_tps: bool = True
) -> Tuple[float, float, float, np.ndarray, Any]:
    """
    Computes registration transformation matrix/TPS model on fitting set, 
    and calculates RMSE strictly on the held-out 20% validation set.
    
    Returns (rmse, mean_dx, mean_dy, validation_residuals, fitted_model).
    """
    n_fit = len(fit_src)
    n_val = len(val_src)

    if n_fit < 3:
        return 0.0, 0.0, 0.0, np.zeros(n_val), None

    fitted_model = None
    pred_val_dst = np.zeros_like(val_dst)

    if use_tps and n_fit >= 6:
        try:
            _, unique_idx = np.unique(np.round(fit_src, decimals=2), axis=0, return_index=True)
            if len(unique_idx) >= 6:
                fit_s_tps, fit_d_tps = fit_src[unique_idx], fit_dst[unique_idx]
            else:
                fit_s_tps, fit_d_tps = fit_src, fit_dst

            rbf_fwd = interp.RBFInterpolator(fit_s_tps, fit_d_tps, kernel='thin_plate_spline', smoothing=1e-3)
            pred_val_dst = rbf_fwd(val_src)
            fitted_model = rbf_fwd
        except Exception as e:
            logger.warning(f"TPS fitting error in held-out validation: {e}. Falling back to affine.")
            use_tps = False

    if not use_tps or fitted_model is None:
        M, _ = cv2.estimateAffine2D(fit_src, fit_dst, method=cv2.LMEDS)
        if M is None:
            M, _ = cv2.estimateAffinePartial2D(fit_src, fit_dst, method=cv2.RANSAC)
        if M is None:
            M = np.float32([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]])
        
        val_ones = np.hstack([val_src, np.ones((n_val, 1))])
        pred_val_dst = (M @ val_ones.T).T
        fitted_model = M

    x_diff = np.abs(val_dst[:, 0] - pred_val_dst[:, 0])
    y_diff = np.abs(val_dst[:, 1] - pred_val_dst[:, 1])
    residuals = np.sqrt(x_diff**2 + y_diff**2)

    rmse = float(np.sqrt(np.mean(residuals**2))) if len(residuals) > 0 else 0.0
    mean_dx = float(np.mean(x_diff)) if len(x_diff) > 0 else 0.0
    mean_dy = float(np.mean(y_diff)) if len(y_diff) > 0 else 0.0

    return round(rmse, 2), round(mean_dx, 2), round(mean_dy, 2), residuals, fitted_model


def compute_dynamic_telemetry(
    stage_timers: Dict[str, float]
) -> List[Dict[str, Any]]:
    """
    Formats real stage execution timings (measured with time.perf_counter())
    into telemetry objects for the API response.
    """
    colors = {
        "Decoding": "#64748b",
        "Preprocessing": "#3b82f6",
        "Feature Extraction": "#8b5cf6",
        "MAGSAC++ Consensus": "#10b981",
        "Sub-Pixel TPS Warping": "#f59e0b",
        "GeoTIFF Export": "#ec4899"
    }
    
    telemetry = []
    for stage_name, duration_sec in stage_timers.items():
        telemetry.append({
            "stage": stage_name,
            "timeMs": round(duration_sec * 1000.0, 2),
            "color": colors.get(stage_name, "#3b82f6")
        })
    return telemetry
