import time
import logging
import io
import numpy as np
import cv2
from PIL import Image
from typing import Tuple, Dict, Any, List, Optional
import torch

from pipeline import run_registration_pipeline, get_loftr_model, apply_clahe_preprocessing, resize_with_aspect_ratio, compute_tile_heatmap, match_sift_pair

logger = logging.getLogger("chandradrishti.matching")


def match_with_opencv_sift(
    img1_gray: np.ndarray,
    img2_gray: np.ndarray
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """High-Precision SIFT Feature Matcher."""
    return match_sift_pair(img1_gray, img2_gray, max_features=2000)


def compute_robust_registration(src_pts: np.ndarray, dst_pts: np.ndarray) -> Dict[str, Any]:
    """Legacy registration function preserved for backward compatibility."""
    total_candidates = len(src_pts) if src_pts is not None else 0
    if src_pts is None or dst_pts is None or total_candidates < 4:
        return {
            "status": "FAILED",
            "reason": "Insufficient inlier ground tie-points",
            "transformation_matrix": [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]],
            "metrics": {
                "rmse": 0.0, "x_residual": 0.0, "y_residual": 0.0,
                "inlier_count": 0, "outlier_count": total_candidates,
                "total_candidates": total_candidates, "total_matches": total_candidates, "inlier_ratio": 0.0, "confidence_score": 0.0,
                "spatial_coverage": 0.0, "spatial_coverage_4x4": 0.0
            },
            "correspondences": []
        }

    H, mask_magsac = cv2.findHomography(
        src_pts, dst_pts, method=cv2.USAC_MAGSAC, ransacReprojThreshold=2.5, confidence=0.999, maxIters=10000
    )

    if mask_magsac is None or H is None:
        affine_mat, mask_magsac = cv2.estimateAffine2D(src_pts, dst_pts, method=cv2.USAC_MAGSAC, ransacReprojThreshold=2.5)
        if affine_mat is not None:
            H = np.vstack([affine_mat, [0.0, 0.0, 1.0]])

    if mask_magsac is None or H is None:
        return {
            "status": "FAILED",
            "reason": "Insufficient inlier ground tie-points",
            "transformation_matrix": [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]],
            "metrics": {
                "rmse": 0.0, "x_residual": 0.0, "y_residual": 0.0,
                "inlier_count": 0, "outlier_count": total_candidates,
                "total_candidates": total_candidates, "total_matches": total_candidates, "inlier_ratio": 0.0, "confidence_score": 0.0,
                "spatial_coverage": 0.0, "spatial_coverage_4x4": 0.0
            },
            "correspondences": []
        }

    inlier_mask = mask_magsac.ravel() == 1
    inliers_src = src_pts[inlier_mask]
    inliers_dst = dst_pts[inlier_mask]
    inlier_count = int(len(inliers_src))

    if inlier_count < 4:
        return {
            "status": "FAILED",
            "reason": "Insufficient inlier ground tie-points",
            "transformation_matrix": [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]],
            "metrics": {
                "rmse": 0.0, "x_residual": 0.0, "y_residual": 0.0,
                "inlier_count": inlier_count, "outlier_count": total_candidates - inlier_count,
                "total_candidates": total_candidates, "total_matches": total_candidates, "inlier_ratio": 0.0, "confidence_score": 0.0,
                "spatial_coverage": 0.0, "spatial_coverage_4x4": 0.0
            },
            "correspondences": []
        }

    inlier_ratio_val = float(inlier_count / total_candidates)
    inlier_ratio_pct = round(inlier_ratio_val * 100.0, 1)

    M_affine, _ = cv2.estimateAffine2D(inliers_src, inliers_dst, method=cv2.LMEDS)
    if M_affine is None:
        M_affine = np.float32([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]])

    pred_dst = (M_affine @ np.hstack([inliers_src, np.ones((inlier_count, 1))]).T).T
    x_diff = np.abs(inliers_dst[:, 0] - pred_dst[:, 0])
    y_diff = np.abs(inliers_dst[:, 1] - pred_dst[:, 1])
    residuals = np.sqrt(x_diff**2 + y_diff**2)

    rmse_total = round(float(np.sqrt(np.mean(residuals**2))), 2) if len(residuals) > 0 else 0.0
    mean_dx = round(float(np.mean(x_diff)), 2) if len(x_diff) > 0 else 0.0
    mean_dy = round(float(np.mean(y_diff)), 2) if len(y_diff) > 0 else 0.0

    inlier_score = min(100.0, (inlier_count / 50.0) * 50.0 + (inlier_ratio_val * 50.0))
    rmse_score = max(0.0, 100.0 - (rmse_total * 6.0))
    confidence_score = float(round(max(0.0, min(100.0, 0.50 * inlier_score + 0.50 * rmse_score)), 1))

    match_payload = []
    for idx in range(total_candidates):
        is_inlier = bool(inlier_mask[idx])
        res = float(residuals[idx]) if is_inlier and idx < len(residuals) else 6.5
        match_payload.append({
            "id": f"#{idx+1:04d}",
            "src": [round(float(src_pts[idx][0]), 2), round(float(src_pts[idx][1]), 2)],
            "dst": [round(float(dst_pts[idx][0]), 2), round(float(dst_pts[idx][1]), 2)],
            "residual_px": round(res, 2),
            "confidence": round(float(max(5.0, min(99.0, 100.0 - (res * 5.0)))), 1),
            "classification": "INLIER" if is_inlier else "OUTLIER"
        })

    return {
        "status": "success",
        "transformation_matrix": M_affine.tolist(),
        "metrics": {
            "rmse": rmse_total,
            "x_residual": mean_dx,
            "y_residual": mean_dy,
            "inlier_count": inlier_count,
            "outlier_count": total_candidates - inlier_count,
            "total_candidates": total_candidates,
            "inlier_ratio": inlier_ratio_pct,
            "confidence_score": confidence_score
        },
        "correspondences": match_payload,
        "inliers_mask": inlier_mask
    }


def match_lunar_images(source_bytes: bytes, reference_bytes: bytes, mode: str = "fast") -> Dict[str, Any]:
    """
    Main image registration entry point. Delegates to full ChandraDrishti pipeline.
    """
    return run_registration_pipeline(source_bytes, reference_bytes, mode=mode, transform_type="tps")
