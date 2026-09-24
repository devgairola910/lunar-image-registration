import type { 
  SensorInfo, 
  SensorType, 
  PresetScenario, 
  KeypointMatch, 
  RegistrationMetrics, 
  TileHeatmapCell, 
  HistoricalRun 
} from '../types/registration';

export const SENSORS: Record<SensorType, SensorInfo> = {
  CH2_OHRC: {
    id: 'CH2_OHRC',
    name: 'Chandrayaan-2 OHRC (Orbiter High Resolution Camera)',
    mission: 'Chandrayaan-2',
    nominalGsd: 0.25,
    band: 'Panchromatic (450–900 nm)',
    description: 'Ultra-high-resolution imaging (0.25 m/pixel) for hazard mapping and detailed crater morphological analysis.'
  },
  CH2_TMC: {
    id: 'CH2_TMC',
    name: 'Chandrayaan-2 TMC-2 (Terrain Mapping Camera-2)',
    mission: 'Chandrayaan-2',
    nominalGsd: 5.0,
    band: 'Panchromatic Stereo (Fore, Nadir, Aft)',
    description: 'Stereo-triplet imagery generating high-precision Digital Elevation Models (DEMs).'
  },
  CH2_IIRS: {
    id: 'CH2_IIRS',
    name: 'Chandrayaan-2 IIRS (Imaging Infrared Spectrometer)',
    mission: 'Chandrayaan-2',
    nominalGsd: 80.0,
    band: 'Near & Short-Wave IR (0.8–5.0 µm)',
    description: 'Hyperspectral mineralogical mapping and hydration absorption band detection (3.0 µm OH/H2O).'
  },
  CH1_TMC: {
    id: 'CH1_TMC',
    name: 'Chandrayaan-1 TMC (Terrain Mapping Camera)',
    mission: 'Chandrayaan-1',
    nominalGsd: 5.0,
    band: 'Panchromatic Stereo (500–850 nm)',
    description: 'Chandrayaan-1 high-precision stereo terrain basemap (5 m/pixel).'
  },
  ISRO_MOSAIC: {
    id: 'ISRO_MOSAIC',
    name: 'ISRO ISSDC Global Lunar Mosaic',
    mission: 'ISRO ISSDC',
    nominalGsd: 25.0,
    band: 'Calibrated Panchromatic Mosaic',
    description: 'ISRO Indian Space Science Data Centre calibrated lunar reference mosaic.'
  },
  OTHER: {
    id: 'OTHER',
    name: 'Custom / Other ISRO Frame',
    mission: 'Custom',
    nominalGsd: 1.0,
    band: 'Optical / Radar / DEM',
    description: 'Custom optical or synthetic aperture radar (DFSAR) lunar dataset.'
  }
};

// Generate realistic preset datasets
export function getPresetScenarios(): PresetScenario[] {
  return [
    {
      id: 'preset_clavius_basin',
      title: 'Clavius Crater (Highlands)',
      targetFeature: 'Crater Interior & Internal Arc (Clavius D, C, N, J)',
      location: '58.4°S, 14.4°W (Southern Highlands)',
      difficulty: 'High Illumination Delta',
      description: 'Co-registration between Chandrayaan-2 moving sensor frame and ISRO high-resolution reference baseline over complex cratered terrain.',
      sourceMeta: {
        sensorType: 'CH2_OHRC',
        sunElevation: 18.0,
        resolution: 0.25,
        phaseAngle: 72.0,
        centerCoordinates: { lat: -58.4, lon: -14.4 },
        imageName: 'CH2_OHRC_20231102T0418_CLAVIUS.tif',
        previewUrl: '/lunar_clavius_source.png'
      },
      referenceMeta: {
        sensorType: 'CH2_TMC',
        sunElevation: 52.0,
        resolution: 5.0,
        phaseAngle: 38.0,
        centerCoordinates: { lat: -58.4, lon: -14.4 },
        imageName: 'ISRO_TMC2_REF_BASE_CLAVIUS.tif',
        previewUrl: '/lunar_clavius_reference.png'
      },
      sourceSvgOrCanvas: '/lunar_clavius_source.png',
      refSvgOrCanvas: '/lunar_clavius_reference.png'
    },
    {
      id: 'preset_tycho_peak',
      title: 'Tycho Crater (Central Peak)',
      targetFeature: 'Central Uplift Peak & Impact Melt Terrace',
      location: '43.3°S, 11.2°W (Southern Highlands)',
      difficulty: 'Extreme Scale Variation',
      description: 'Chandrayaan-2 OHRC high-resolution frame (0.32 m/px) matched with ISRO TMC-2 Stereo Baseline across terraced topography.',
      sourceMeta: {
        sensorType: 'CH2_OHRC',
        sunElevation: 28.0,
        resolution: 0.32,
        phaseAngle: 62.0,
        centerCoordinates: { lat: -43.3, lon: -11.2 },
        imageName: 'CH2_OHRC_20191017_TYCHO_PEAK.tif',
        previewUrl: '/lunar_tycho_source.jpg'
      },
      referenceMeta: {
        sensorType: 'CH2_TMC',
        sunElevation: 54.0,
        resolution: 5.0,
        phaseAngle: 36.0,
        centerCoordinates: { lat: -43.3, lon: -11.2 },
        imageName: 'ISRO_TMC2_BASE_TYCHO_ORBIT6485.tif',
        previewUrl: '/lunar_tycho_reference.jpg'
      },
      sourceSvgOrCanvas: '/lunar_tycho_source.jpg',
      refSvgOrCanvas: '/lunar_tycho_reference.jpg'
    },
    {
      id: 'preset_boguslawsky_pole',
      title: 'Boguslawsky Crater (South Pole)',
      targetFeature: 'Polar Landing Corridor & Floor Smooth Basalt',
      location: '69.7°S, 74.4°E (Lunar South Pole Region)',
      difficulty: 'Standard',
      description: 'Chandrayaan-2 OHRC high-resolution frame co-registered to ISRO TMC-2 reference baseline for surface landing safety certification.',
      sourceMeta: {
        sensorType: 'CH2_OHRC',
        sunElevation: 1.2,
        resolution: 0.32,
        phaseAngle: 104.5,
        centerCoordinates: { lat: -69.7, lon: 74.4 },
        imageName: 'CH2_OHRC_20210816_BOGUSLAWSKY.tif',
        previewUrl: '/lunar_boguslawsky_source.jpg'
      },
      referenceMeta: {
        sensorType: 'CH2_TMC',
        sunElevation: 4.8,
        resolution: 3.2,
        phaseAngle: 82.1,
        centerCoordinates: { lat: -69.7, lon: 74.4 },
        imageName: 'ISRO_TMC2_BASE_BOGUSLAWSKY_ORBIT2843.tif',
        previewUrl: '/lunar_boguslawsky_reference.jpg'
      },
      sourceSvgOrCanvas: '/lunar_boguslawsky_source.jpg',
      refSvgOrCanvas: '/lunar_boguslawsky_reference.jpg'
    }
  ];
}

// Generate realistic keypoints with MAGSAC++ results
export function generateKeypointDataset(
  width = 600, 
  height = 600, 
  totalCount = 380, 
  inlierRatio = 0.88,
  seed = 42
): { keypoints: KeypointMatch[]; metrics: RegistrationMetrics } {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const keypoints: KeypointMatch[] = [];
  const inlierCount = Math.round(totalCount * inlierRatio);

  // Affine / Projective geometric warp parameters (approx source -> ref transformation)
  const angle = (1.8 * Math.PI) / 180;
  const scale = 1.015;
  const tx = 14.5;
  const ty = -9.2;
  const cosA = Math.cos(angle) * scale;
  const sinA = Math.sin(angle) * scale;

  // Initialize 8x8 tile heatmap
  const tileGrid: TileHeatmapCell[][] = [];
  for (let r = 0; r < 8; r++) {
    const row: TileHeatmapCell[] = [];
    for (let c = 0; c < 8; c++) {
      row.push({ row: r, col: c, matchCount: 0, inlierCount: 0, densityScore: 0 });
    }
    tileGrid.push(row);
  }

  let sumErrSq = 0;
  let sumErrX = 0;
  let sumErrY = 0;

  for (let i = 0; i < totalCount; i++) {
    const isInlier = i < inlierCount;

    // Distribute across image with cluster around crater rims
    const srcX = Math.round(30 + rand() * (width - 60));
    const srcY = Math.round(30 + rand() * (height - 60));

    const tileR = Math.min(7, Math.floor((srcY / height) * 8));
    const tileC = Math.min(7, Math.floor((srcX / width) * 8));

    tileGrid[tileR][tileC].matchCount++;
    if (isInlier) tileGrid[tileR][tileC].inlierCount++;

    let refX: number;
    let refY: number;
    let residualErr: number;
    let confidence: number;

    if (isInlier) {
      // Small Gaussian-like sub-pixel jitter
      const errX = (rand() - 0.5) * 0.95;
      const errY = (rand() - 0.5) * 0.95;
      residualErr = parseFloat(Math.sqrt(errX * errX + errY * errY).toFixed(2));
      confidence = parseFloat((0.82 + rand() * 0.17).toFixed(3));

      // Ground truth mapped coordinate
      const mappedX = cosA * (srcX - width / 2) - sinA * (srcY - height / 2) + width / 2 + tx;
      const mappedY = sinA * (srcX - width / 2) + cosA * (srcY - height / 2) + height / 2 + ty;

      refX = parseFloat((mappedX + errX).toFixed(2));
      refY = parseFloat((mappedY + errY).toFixed(2));

      sumErrSq += residualErr * residualErr;
      sumErrX += Math.abs(errX);
      sumErrY += Math.abs(errY);
    } else {
      // Outlier mismatch (e.g. shadow edge confusion or false texture correlation)
      const errX = (rand() - 0.5) * 60 + 20;
      const errY = (rand() - 0.5) * 60 - 20;
      residualErr = parseFloat((4.5 + rand() * 18.5).toFixed(2));
      confidence = parseFloat((0.25 + rand() * 0.45).toFixed(3));

      refX = parseFloat((srcX + errX).toFixed(2));
      refY = parseFloat((srcY + errY).toFixed(2));
    }

    keypoints.push({
      id: i + 1,
      srcX,
      srcY,
      refX,
      refY,
      residualError: residualErr,
      confidence,
      isInlier,
      tileIndex: tileR * 8 + tileC
    });
  }

  // Calculate density scores for heatmap
  let maxMatchesInTile = 1;
  tileGrid.forEach(row => row.forEach(c => {
    if (c.matchCount > maxMatchesInTile) maxMatchesInTile = c.matchCount;
  }));
  let coveredTiles = 0;
  tileGrid.forEach(row => row.forEach(c => {
    c.densityScore = parseFloat((c.matchCount / maxMatchesInTile).toFixed(2));
    if (c.inlierCount >= 2) coveredTiles++;
  }));

  const spatialCoverage = parseFloat(((coveredTiles / 64) * 100).toFixed(1));
  const rmseTotal = parseFloat(Math.sqrt(sumErrSq / inlierCount).toFixed(2));
  const rmseX = parseFloat((sumErrX / inlierCount).toFixed(2));
  const rmseY = parseFloat((sumErrY / inlierCount).toFixed(2));
  const actualInlierRatio = parseFloat(((inlierCount / totalCount) * 100).toFixed(1));

  // Overall Confidence Score (weighted composite of RMSE, inlier ratio, and spatial coverage)
  const confidenceScore = parseFloat(
    Math.min(99.4, (actualInlierRatio * 0.4 + spatialCoverage * 0.4 + Math.max(0, (2.0 - rmseTotal) * 10))).toFixed(1)
  );

  const confidenceLevel = confidenceScore >= 85 ? 'HIGH' : confidenceScore >= 65 ? 'MEDIUM' : 'LOW';

  const metrics: RegistrationMetrics = {
    rmseTotal,
    rmseX,
    rmseY,
    inlierRatio: actualInlierRatio,
    totalMatches: totalCount,
    inlierMatches: inlierCount,
    spatialCoverage,
    confidenceScore,
    confidenceLevel,
    processingTimeTotalMs: 4620,
    stageTimings: [
      { stage: 'Preprocessing & SPICE', timeMs: 640, color: '#3ea6ff' },
      { stage: 'Feature Extraction (LoFTR)', timeMs: 1420, color: '#8b5cf6' },
      { stage: 'Tile-Based Matching', timeMs: 880, color: '#2dd4bf' },
      { stage: 'Geometric MAGSAC++', timeMs: 1120, color: '#f0a83c' },
      { stage: 'Sub-Pixel Refinement', timeMs: 560, color: '#10b981' }
    ],
    homographyMatrix: [
      [parseFloat(cosA.toFixed(6)), parseFloat((-sinA).toFixed(6)), parseFloat(tx.toFixed(4))],
      [parseFloat(sinA.toFixed(6)), parseFloat(cosA.toFixed(6)), parseFloat(ty.toFixed(4))],
      [0.000004, -0.000002, 1.000000]
    ],
    tileHeatmap: tileGrid
  };

  return { keypoints, metrics };
}

// Generate Low Correspondence / Irrelevant Image Pair Dataset
export function generateLowCorrespondenceDataset(): { keypoints: KeypointMatch[]; metrics: RegistrationMetrics } {
  const totalMatches = 40;
  const inlierMatches = 4;
  const keypoints: KeypointMatch[] = [];

  for (let i = 0; i < totalMatches; i++) {
    const isInlier = i < inlierMatches;
    const srcX = Math.floor(40 + Math.random() * 520);
    const srcY = Math.floor(40 + Math.random() * 520);
    let refX: number;
    let refY: number;
    let residualError: number;
    let confidence: number;

    if (isInlier) {
      refX = srcX + (Math.random() - 0.5) * 4;
      refY = srcY + (Math.random() - 0.5) * 4;
      residualError = 2.8;
      confidence = 0.45;
    } else {
      refX = Math.floor(40 + Math.random() * 520);
      refY = Math.floor(40 + Math.random() * 520);
      residualError = 15.0 + Math.random() * 40.0;
      confidence = 0.15;
    }

    keypoints.push({
      id: i + 1,
      srcX,
      srcY,
      refX: Math.floor(refX),
      refY: Math.floor(refY),
      residualError: parseFloat(residualError.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(2)),
      isInlier,
      tileIndex: Math.floor(srcY / 75) * 8 + Math.floor(srcX / 75)
    });
  }

  const tileGrid: TileHeatmapCell[][] = [];
  for (let r = 0; r < 8; r++) {
    tileGrid[r] = [];
    for (let c = 0; c < 8; c++) {
      tileGrid[r][c] = {
        row: r,
        col: c,
        matchCount: r < 2 && c < 2 ? 3 : 0,
        inlierCount: r === 0 && c === 0 ? 1 : 0,
        densityScore: r < 2 && c < 2 ? 0.3 : 0
      };
    }
  }

  const metrics: RegistrationMetrics = {
    rmseTotal: 18.42,
    rmseX: 12.85,
    rmseY: 13.18,
    inlierRatio: 10.0,
    totalMatches,
    inlierMatches,
    spatialCoverage: 12.5,
    confidenceScore: 12.0,
    confidenceLevel: 'LOW',
    processingTimeTotalMs: 3200,
    stageTimings: [
      { stage: 'Preprocessing & SPICE', timeMs: 420, color: '#ef4444' },
      { stage: 'Feature Extraction (LoFTR)', timeMs: 1200, color: '#ef4444' },
      { stage: 'Tile-Based Matching', timeMs: 400, color: '#ef4444' },
      { stage: 'Geometric MAGSAC++', timeMs: 800, color: '#ef4444' },
      { stage: 'Sub-Pixel Refinement', timeMs: 380, color: '#ef4444' }
    ],
    homographyMatrix: [
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0]
    ],
    tileHeatmap: tileGrid
  };

  return { keypoints, metrics };
}

// Initial historical mission runs
export function getInitialHistoricalRuns(): HistoricalRun[] {
  const presets = getPresetScenarios();
  
  const claviusData = generateKeypointDataset(600, 600, 420, 0.89, 101);
  const tychoData = generateKeypointDataset(600, 600, 310, 0.84, 202);
  const boguslawskyData = generateKeypointDataset(600, 600, 275, 0.91, 303);

  return [
    {
      id: 'RUN-2026-CH2-0884',
      title: 'Clavius Crater Highlands High-Precision Co-Registration',
      targetFeature: 'Interior Multi-Crater Arc & Basin Floor (58.4°S, 14.4°W)',
      timestamp: '2026-09-10 14:32:19 UTC',
      sourceMeta: presets[0].sourceMeta,
      referenceMeta: presets[0].referenceMeta,
      metrics: claviusData.metrics,
      keypoints: claviusData.keypoints
    },
    {
      id: 'RUN-2026-CH2-0879',
      title: 'Tycho Crater Central Peak Stereo DEM Alignment',
      targetFeature: 'Central Uplift & Terraced Slopes (43.3°S, 11.2°W)',
      timestamp: '2026-09-08 09:15:40 UTC',
      sourceMeta: presets[1].sourceMeta,
      referenceMeta: presets[1].referenceMeta,
      metrics: tychoData.metrics,
      keypoints: tychoData.keypoints
    },
    {
      id: 'RUN-2026-CH2-0872',
      title: 'Boguslawsky Polar Landing Corridor Co-Registration',
      targetFeature: 'Polar Landing Zone Safety Mapping (72.9°S, 43.2°E)',
      timestamp: '2026-09-04 18:48:02 UTC',
      sourceMeta: presets[2].sourceMeta,
      referenceMeta: presets[2].referenceMeta,
      metrics: boguslawskyData.metrics,
      keypoints: boguslawskyData.keypoints
    }
  ];
}
