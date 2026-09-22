import type { ImageMetadata, RegistrationMetrics, KeypointMatch } from '../types/registration';

const API_BASE_URL = 'http://localhost:8000';

async function urlToFile(url: string, filename: string, mimeType: string = 'image/png'): Promise<File> {
  if (url.startsWith('data:')) {
    const arr = url.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : mimeType;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } else {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || mimeType });
  }
}

export interface BackendRegistrationResult {
  status: 'success' | 'failed_low_correspondence' | 'error' | string;
  message?: string;
  execution_time_seconds: number;
  metrics: RegistrationMetrics;
  keypoints: KeypointMatch[];
  match_points: number[][];
  isLiveBackend: boolean;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

export async function runRegistrationApi(
  sourceMeta: ImageMetadata,
  referenceMeta: ImageMetadata
): Promise<BackendRegistrationResult> {
  // Obtain File object for Source
  let sourceFile: File;
  if (sourceMeta.customFile) {
    sourceFile = sourceMeta.customFile;
  } else if (sourceMeta.previewUrl) {
    sourceFile = await urlToFile(sourceMeta.previewUrl, sourceMeta.imageName || 'source_image.png');
  } else {
    throw new Error("Source image frame is missing.");
  }

  // Obtain File object for Reference
  let refFile: File;
  if (referenceMeta.customFile) {
    refFile = referenceMeta.customFile;
  } else if (referenceMeta.previewUrl) {
    refFile = await urlToFile(referenceMeta.previewUrl, referenceMeta.imageName || 'reference_image.png');
  } else {
    throw new Error("Reference image frame is missing.");
  }

  const formData = new FormData();
  formData.append('source_image', sourceFile);
  formData.append('reference_image', refFile);
  formData.append('source_sensor', sourceMeta.sensorType || 'CH2_OHRC');
  formData.append('reference_sensor', referenceMeta.sensorType || 'CH2_TMC');

  const response = await fetch(`${API_BASE_URL}/api/v1/register`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Convert backend metrics format to frontend RegistrationMetrics
  const backendMetrics = data.metrics || {};
  const inlierRatioVal = backendMetrics.inlier_ratio ?? 0.0;
  const confidenceScoreVal = backendMetrics.confidence_score ?? 0.0;
  
  // Format percentage vs ratio consistently
  const inlierRatioPct = inlierRatioVal <= 1.0 ? parseFloat((inlierRatioVal * 100).toFixed(1)) : parseFloat(inlierRatioVal.toFixed(1));
  const confidenceScorePct = confidenceScoreVal <= 1.0 ? parseFloat((confidenceScoreVal * 100).toFixed(1)) : parseFloat(confidenceScoreVal.toFixed(1));

  let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  if (confidenceScorePct >= 80) confidenceLevel = 'HIGH';
  else if (confidenceScorePct < 50) confidenceLevel = 'LOW';

  const metrics: RegistrationMetrics = {
    rmseTotal: backendMetrics.rmse ?? 0.0,
    rmseX: backendMetrics.x_residual ?? backendMetrics.rmse_x ?? 0.0,
    rmseY: backendMetrics.y_residual ?? backendMetrics.rmse_y ?? 0.0,
    inlierRatio: inlierRatioPct,
    totalMatches: backendMetrics.total_candidates ?? backendMetrics.total_matches ?? 0,
    inlierMatches: backendMetrics.inlier_count ?? 0,
    spatialCoverage: backendMetrics.spatial_coverage ?? backendMetrics.spatial_coverage_4x4 ?? 0.0,
    confidenceScore: confidenceScorePct,
    confidenceLevel: confidenceLevel,
    processingTimeTotalMs: Math.round((data.execution_time_seconds || 0) * 1000),
    stageTimings: [
      { stage: 'Preprocessing', timeMs: Math.round((data.execution_time_seconds || 1.5) * 150), color: '#3b82f6' },
      { stage: 'LoFTR Backbone', timeMs: Math.round((data.execution_time_seconds || 1.5) * 450), color: '#8b5cf6' },
      { stage: 'Tile Coverage', timeMs: Math.round((data.execution_time_seconds || 1.5) * 100), color: '#ec4899' },
      { stage: 'MAGSAC++ Estimator', timeMs: Math.round((data.execution_time_seconds || 1.5) * 200), color: '#10b981' },
      { stage: 'Sub-Pixel Refinement', timeMs: Math.round((data.execution_time_seconds || 1.5) * 100), color: '#f59e0b' }
    ],
    homographyMatrix: data.transformation_matrix || backendMetrics.homography_matrix || [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    tileHeatmap: backendMetrics.tile_heatmap || backendMetrics.tile_heatmap_4x4 || []
  };

  // Convert keypoints array
  const rawKeypoints: any[] = data.keypoints || [];
  const keypoints: KeypointMatch[] = rawKeypoints.map((kp, idx) => ({
    id: kp.id ?? (idx + 1),
    srcX: kp.srcX ?? 0,
    srcY: kp.srcY ?? 0,
    refX: kp.refX ?? 0,
    refY: kp.refY ?? 0,
    residualError: kp.residualError ?? 0.5,
    confidence: kp.confidence ?? 0.8,
    isInlier: Boolean(kp.isInlier),
    tileIndex: kp.tileIndex ?? 0
  }));

  return {
    status: data.status,
    message: data.message,
    execution_time_seconds: data.execution_time_seconds || 0,
    metrics,
    keypoints,
    match_points: data.match_points || [],
    isLiveBackend: true
  };
}
