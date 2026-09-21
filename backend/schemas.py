from typing import List, Optional, Any
from pydantic import BaseModel, Field

class TileHeatmapCell(BaseModel):
    row: int
    col: int
    matchCount: int
    inlierCount: int
    densityScore: float

class CorrespondenceItem(BaseModel):
    id: str
    src: List[float]
    dst: List[float]
    residual_px: float
    confidence: float
    classification: str

class RegistrationMetrics(BaseModel):
    rmse: float = Field(..., description="Root Mean Square Error of reprojected inliers in pixels")
    rmse_x: Optional[float] = Field(0.0, description="RMSE in X axis")
    rmse_y: Optional[float] = Field(0.0, description="RMSE in Y axis")
    x_residual: Optional[float] = Field(0.0, description="Mean X residual in pixels")
    y_residual: Optional[float] = Field(0.0, description="Mean Y residual in pixels")
    inlier_count: int = Field(..., description="Number of verified inlier matches")
    outlier_count: Optional[int] = Field(0, description="Number of rejected outlier candidate points")
    total_candidates: Optional[int] = Field(0, description="Total candidate points extracted")
    total_matches: Optional[int] = Field(0, description="Total matches detected")
    inlier_ratio: float = Field(..., description="Ratio of inliers to total matches (percentage 0.0 - 100.0 or 0.0 - 1.0)")
    confidence_score: float = Field(..., description="Overall registration confidence score (0.0 - 100.0)")
    spatial_coverage: Optional[float] = Field(0.0, description="Percentage of tiles containing valid inliers")
    spatial_coverage_4x4: Optional[float] = Field(0.0, description="4x4 Grid Coverage percentage")
    homography_matrix: Optional[List[List[float]]] = Field(default_factory=list)
    tile_heatmap: Optional[List[List[TileHeatmapCell]]] = Field(default_factory=list)
    tile_heatmap_4x4: Optional[List[List[TileHeatmapCell]]] = Field(default_factory=list)

class KeypointMatchItem(BaseModel):
    id: int
    srcX: float
    srcY: float
    refX: float
    refY: float
    residualError: float
    confidence: float
    isInlier: bool
    tileIndex: int

class RegistrationResponse(BaseModel):
    status: str = Field(..., description="Registration status: success | failed_low_correspondence | error")
    message: Optional[str] = Field(None, description="Detailed message or error details")
    execution_time_seconds: Optional[float] = Field(0.0, description="Total processing time in seconds")
    transformation_matrix: Optional[List[List[float]]] = Field(default_factory=list)
    metrics: RegistrationMetrics
    match_points: List[List[float]] = Field(default_factory=list, description="List of [src_x, src_y, ref_x, ref_y] scaled to original dimensions")
    keypoints: List[KeypointMatchItem] = Field(default_factory=list, description="Detailed keypoint list for frontend viewer")
    correspondences: Optional[List[CorrespondenceItem]] = Field(default_factory=list)
    source_image_info: Optional[dict] = None
    reference_image_info: Optional[dict] = None
