import os
import logging
import numpy as np
import cv2
from typing import Tuple, Dict, Any, Optional
import scipy.interpolate as interp

logger = logging.getLogger("chandradrishti.registration")

try:
    import rasterio
    from rasterio.transform import Affine
    from rasterio.crs import CRS
    RASTERIO_AVAILABLE = True
except ImportError:
    RASTERIO_AVAILABLE = False
    logger.warning("rasterio package not available; GeoTIFF export will fall back to standard image writing.")


def compute_tps_warp(
    src_img: np.ndarray,
    inliers_src: np.ndarray,
    inliers_dst: np.ndarray,
    ref_shape: Tuple[int, int]
) -> Tuple[np.ndarray, str]:
    """
    Thin Plate Spline (TPS) elastic surface warping for push-broom sensor distortion correction.
    
    If tie-points < 6, falls back to Sector/Global Affine transformation.
    
    Returns (warped_image, transform_type_used).
    """
    ref_h, ref_w = ref_shape[:2]
    num_pts = len(inliers_src) if inliers_src is not None else 0

    if num_pts < 6:
        logger.info(f"Tie-points count ({num_pts}) < 6. Using Affine transformation fallback.")
        if num_pts >= 3:
            M, _ = cv2.estimateAffine2D(inliers_src, inliers_dst, method=cv2.RANSAC)
            if M is None:
                M = np.float32([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]])
        else:
            M = np.float32([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]])

        warped = cv2.warpAffine(src_img, M, (ref_w, ref_h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        return warped, "affine_fallback"

    try:
        # Deduplicate coincident control points
        _, unique_indices = np.unique(np.round(inliers_dst, decimals=2), axis=0, return_index=True)
        if len(unique_indices) < 6:
            unique_indices = np.arange(len(inliers_dst))

        tps_dst = inliers_dst[unique_indices]
        tps_src = inliers_src[unique_indices]

        # Fit TPS mapping from reference coordinates (dst) back to source coordinates (src)
        rbf_warp = interp.RBFInterpolator(tps_dst, tps_src, kernel='thin_plate_spline', smoothing=1e-3)

        # Build coarse grid for fast interpolation (e.g., 64x64)
        coarse_h = min(64, ref_h)
        coarse_w = min(64, ref_w)

        gy, gx = np.mgrid[0:coarse_h, 0:coarse_w]
        scale_y = float(ref_h - 1) / float(coarse_h - 1) if coarse_h > 1 else 1.0
        scale_x = float(ref_w - 1) / float(coarse_w - 1) if coarse_w > 1 else 1.0

        coarse_ref_pts = np.column_stack([(gx * scale_x).ravel(), (gy * scale_y).ravel()])
        mapped_src_pts = rbf_warp(coarse_ref_pts)

        map_x_coarse = mapped_src_pts[:, 0].reshape(coarse_h, coarse_w).astype(np.float32)
        map_y_coarse = mapped_src_pts[:, 1].reshape(coarse_h, coarse_w).astype(np.float32)

        # Upsample map to full reference resolution
        map_x = cv2.resize(map_x_coarse, (ref_w, ref_h), interpolation=cv2.INTER_LINEAR)
        map_y = cv2.resize(map_y_coarse, (ref_w, ref_h), interpolation=cv2.INTER_LINEAR)

        # Remap source image into target reference geometry
        warped = cv2.warpPerspective if False else cv2.remap(
            src_img, map_x, map_y, interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0
        )
        return warped, "tps_thin_plate_spline"

    except Exception as e:
        logger.warning(f"TPS warping failed with exception: {e}. Falling back to affine transformation.")
        M, _ = cv2.estimateAffine2D(inliers_src, inliers_dst, method=cv2.LMEDS)
        if M is None:
            M = np.float32([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]])
        warped = cv2.warpAffine(src_img, M, (ref_w, ref_h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        return warped, "affine_fallback"


def export_geotiff(
    image_np: np.ndarray,
    output_filepath: str,
    transformation_matrix: Optional[np.ndarray] = None,
    crs_wkt_or_epsg: str = "EPSG:30100"
) -> str:
    """
    Generates real GeoTIFF raster file with updated affine transformation matrices 
    and coordinate reference system (CRS) metadata using rasterio.
    """
    os.makedirs(os.path.dirname(output_filepath), exist_ok=True)
    h, w = image_np.shape[:2]

    # Formulate Affine transform
    if transformation_matrix is not None and transformation_matrix.shape in [(2, 3), (3, 3)]:
        a = float(transformation_matrix[0, 0])
        b = float(transformation_matrix[0, 1])
        c = float(transformation_matrix[0, 2])
        d = float(transformation_matrix[1, 0])
        e = float(transformation_matrix[1, 1])
        f = float(transformation_matrix[1, 2])
        transform = Affine(a, b, c, d, e, f)
    else:
        # Default spatial affine transform (1.0 scale, 0 translation)
        transform = Affine(1.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    count = 1 if len(image_np.shape) == 2 else image_np.shape[2]
    dtype = image_np.dtype

    if RASTERIO_AVAILABLE:
        crs_obj = None
        if crs_wkt_or_epsg:
            try:
                crs_obj = CRS.from_string(crs_wkt_or_epsg)
            except Exception:
                crs_obj = CRS.from_epsg(4326)
        if crs_obj is None:
            crs_obj = CRS.from_epsg(4326)

        with rasterio.open(
            output_filepath,
            'w',
            driver='GTiff',
            height=h,
            width=w,
            count=count,
            dtype=dtype,
            crs=crs_obj,
            transform=transform
        ) as dst:
            if count == 1:
                dst.write(image_np, 1)
            else:
                for b_idx in range(count):
                    dst.write(image_np[:, :, b_idx], b_idx + 1)
        logger.info(f"Successfully generated GeoTIFF raster at {output_filepath}")
    else:
        # Fallback PNG/TIF write via OpenCV if rasterio is missing
        cv2.imwrite(output_filepath, image_np)
        logger.info(f"Wrote standard image raster at {output_filepath}")

    return output_filepath
