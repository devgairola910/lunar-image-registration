import type { KeypointMatch, RegistrationMetrics, ImageMetadata } from '../types/registration';

export function downloadKeypointsCSV(
  keypoints: KeypointMatch[],
  sourceMeta: ImageMetadata,
  refMeta: ImageMetadata,
  filename = 'lunar_registration_keypoints.csv'
) {
  const headers = [
    'point_id',
    'source_sensor',
    'src_x_px',
    'src_y_px',
    'ref_sensor',
    'ref_x_px',
    'ref_y_px',
    'residual_error_px',
    'confidence_score',
    'magsac_classification',
    'tile_index_8x8'
  ];

  const rows = keypoints.map(kp => [
    kp.id,
    sourceMeta.sensorType,
    kp.srcX.toFixed(2),
    kp.srcY.toFixed(2),
    refMeta.sensorType,
    kp.refX.toFixed(2),
    kp.refY.toFixed(2),
    kp.residualError.toFixed(3),
    kp.confidence.toFixed(4),
    kp.isInlier ? 'INLIER' : 'OUTLIER',
    kp.tileIndex
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTelemetryJSON(
  metrics: RegistrationMetrics,
  sourceMeta: ImageMetadata,
  refMeta: ImageMetadata,
  keypoints: KeypointMatch[],
  filename = 'lunar_registration_telemetry.json'
) {
  const payload = {
    missionHeader: {
      generator: 'Lunar Image Correspondence Engine (LICE) v2.4',
      agencyReference: 'ISRO Chandrayaan-2 / NASA LRO Cross-Calibration Node',
      timestampUtc: new Date().toISOString(),
      coordinateFrame: 'MOON_ME (IAU/IAG 2015 Lunar Mean Earth/Polar Axis)',
      confidenceGrade: metrics.confidenceLevel,
      overallConfidenceScore: `${metrics.confidenceScore}%`
    },
    sensorMetadata: {
      source: sourceMeta,
      reference: refMeta
    },
    registrationMetrics: {
      rmseTotalPixels: metrics.rmseTotal,
      rmseXPixels: metrics.rmseX,
      rmseYPixels: metrics.rmseY,
      inlierRatioPercent: metrics.inlierRatio,
      totalKeypointsExtracted: metrics.totalMatches,
      verifiedInliers: metrics.inlierMatches,
      spatialUniformityCoveragePercent: metrics.spatialCoverage,
      homographyMatrix3x3: metrics.homographyMatrix,
      pipelineExecutionTimeMs: metrics.processingTimeTotalMs,
      stageTimings: metrics.stageTimings
    },
    sampleKeypoints: keypoints.slice(0, 50)
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadSimulatedGeoTIFF(
  sourceMeta: ImageMetadata,
  _metrics: RegistrationMetrics,
  filename = 'registered_lunar_ortho.png'
) {
  // Trigger a download of the registered preview with mock worldfile
  if (sourceMeta.previewUrl) {
    const link = document.createElement('a');
    link.setAttribute('href', sourceMeta.previewUrl);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Also trigger accompanying Worldfile .tfw
  const tfwContent = [
    (sourceMeta.resolution / 1000).toFixed(8),
    '0.00000000',
    '0.00000000',
    (-sourceMeta.resolution / 1000).toFixed(8),
    sourceMeta.centerCoordinates.lon.toFixed(8),
    sourceMeta.centerCoordinates.lat.toFixed(8)
  ].join('\n');

  const blob = new Blob([tfwContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const tfwLink = document.createElement('a');
  tfwLink.setAttribute('href', url);
  tfwLink.setAttribute('download', filename.replace(/\.(png|tif|tiff)$/, '.tfw'));
  document.body.appendChild(tfwLink);
  tfwLink.click();
  document.body.removeChild(tfwLink);
  URL.revokeObjectURL(url);
}
