import type { 
  SensorInfo, 
  SensorType, 
  PresetScenario, 
  KeypointMatch, 
  RegistrationMetrics, 
  TileHeatmapCell, 
  HistoricalRun 
} from '../types/registration';
import { generateLunarCanvas } from './lunarRenderer';

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
  LRO_NAC: {
    id: 'LRO_NAC',
    name: 'NASA LRO NAC (Narrow Angle Camera)',
    mission: 'NASA LRO',
    nominalGsd: 0.5,
    band: 'Panchromatic (400–750 nm)',
    description: 'High-resolution global lunar baseline dataset (0.5 to 2.0 m/pixel).'
  },
  LRO_WAC: {
    id: 'LRO_WAC',
    name: 'NASA LRO WAC (Wide Angle Camera)',
    mission: 'NASA LRO',
    nominalGsd: 100.0,
    band: 'Multispectral (7 UV/Visible bands)',
    description: 'Global 100 m/pixel lunar basemap with repetitive lighting observations.'
  },
  CLEMENTINE: {
    id: 'CLEMENTINE',
    name: 'NASA Clementine UVVIS / NIR',
    mission: 'NASA Clementine',
    nominalGsd: 115.0,
    band: 'Multispectral UV-VIS-NIR',
    description: 'Historical global multispectral albedo reference.'
  },
  OTHER: {
    id: 'OTHER',
    name: 'Custom / Other Lunar Sensor',
    mission: 'Custom',
    nominalGsd: 1.0,
    band: 'Optical / Radar / DEM',
    description: 'Custom optical or synthetic aperture radar (SAR) dataset.'
  }
};

// Generate realistic preset datasets
export function getPresetScenarios(): PresetScenario[] {
  // Shackleton Crater (South Pole, extreme sun angle variation)
  const shackletonSrcImg = generateLunarCanvas({
    seed: 4210,
    width: 600,
    height: 600,
    sunElevation: 12.0, // low grazing illumination
    sunAzimuth: 140.0,
    resolutionScale: 1.0,
    rotationDeg: -2.4,
    offsetX: -8,
    offsetY: 6,
    craterPreset: 'shackleton',
    sensorNoiseLevel: 0.04,
    contrastBoost: 1.3
  });

  const shackletonRefImg = generateLunarCanvas({
    seed: 4210,
    width: 600,
    height: 600,
    sunElevation: 68.0, // high overhead illumination
    sunAzimuth: 45.0,
    resolutionScale: 1.0,
    rotationDeg: 0.0,
    offsetX: 0,
    offsetY: 0,
    craterPreset: 'shackleton',
    sensorNoiseLevel: 0.02,
    contrastBoost: 1.0
  });



  // Mare Imbrium (Basalt Plains & Pytheas Crater)
  const mareSrcImg = generateLunarCanvas({
    seed: 1955,
    width: 600,
    height: 600,
    sunElevation: 35.0,
    sunAzimuth: 310.0,
    resolutionScale: 0.95,
    rotationDeg: -1.8,
    offsetX: -5,
    offsetY: -8,
    craterPreset: 'mare_imbrium',
    sensorNoiseLevel: 0.03,
    contrastBoost: 1.2
  });

  const mareRefImg = generateLunarCanvas({
    seed: 1955,
    width: 600,
    height: 600,
    sunElevation: 48.0,
    sunAzimuth: 110.0,
    resolutionScale: 1.0,
    rotationDeg: 0.0,
    offsetX: 0,
    offsetY: 0,
    craterPreset: 'mare_imbrium',
    sensorNoiseLevel: 0.02,
    contrastBoost: 1.0
  });

  return [
    {
      id: 'preset_shackleton_southpole',
      title: 'Shackleton Crater (South Pole)',
      targetFeature: 'Permanent Shadow Region (PSR) & Rim Crest',
      location: '89.9°S, 0.0°E (Lunar South Pole)',
      difficulty: 'High Illumination Delta',
      description: 'Registration between Chandrayaan-2 OHRC (0.25 m/px, 12° grazing sun angle) and NASA LRO NAC (0.5 m/px, 68° high sun angle).',
      sourceMeta: {
        sensorType: 'CH2_OHRC',
        sunElevation: 12.0,
        resolution: 0.25,
        phaseAngle: 78.0,
        centerCoordinates: { lat: -89.9, lon: 0.0 },
        imageName: 'CH2_OHRC_20220914T0812_SHACKLETON.tif',
        previewUrl: shackletonSrcImg
      },
      referenceMeta: {
        sensorType: 'LRO_NAC',
        sunElevation: 68.0,
        resolution: 0.50,
        phaseAngle: 22.0,
        centerCoordinates: { lat: -89.9, lon: 0.0 },
        imageName: 'LRO_NAC_M119842104RE_SHACKLETON.tif',
        previewUrl: shackletonRefImg
      },
      sourceSvgOrCanvas: shackletonSrcImg,
      refSvgOrCanvas: shackletonRefImg
    },
    {
      id: 'preset_tycho_peak',
      title: 'Tycho Crater (Central Peak)',
      targetFeature: 'Central Uplift Peak & Impact Melt Terrace',
      location: '43.3°S, 11.2°W (Southern Highlands)',
      difficulty: 'Extreme Scale Variation',
      description: 'Chandrayaan-2 TMC-2 Stereo Nadir (5.0 m/px) matched with NASA LRO WAC Global Mosaic (100 m/px) across complex terraced topography.',
      sourceMeta: {
        sensorType: 'CH2_TMC',
        sunElevation: 28.0,
        resolution: 5.0,
        phaseAngle: 62.0,
        centerCoordinates: { lat: -43.3, lon: -11.2 },
        imageName: 'CH2_TMC_NAD_20210405_TYCHO.tif',
        previewUrl: '/lunar_tycho_orbital.png'
      },
      referenceMeta: {
        sensorType: 'LRO_WAC',
        sunElevation: 54.0,
        resolution: 100.0,
        phaseAngle: 36.0,
        centerCoordinates: { lat: -43.3, lon: -11.2 },
        imageName: 'LRO_WAC_GLD100_TYCHO.tif',
        previewUrl: '/lunar_tycho_orbital.png'
      },
      sourceSvgOrCanvas: '/lunar_tycho_orbital.png',
      refSvgOrCanvas: '/lunar_tycho_orbital.png'
    },
    {
      id: 'preset_mare_imbrium',
      title: 'Mare Imbrium (Pytheas Crater)',
      targetFeature: 'Basalt Flow Ridge & Ejecta Halo',
      location: '20.5°N, 20.6°W (Mare Basalt Plain)',
      difficulty: 'Standard',
      description: 'Chandrayaan-2 IIRS Hyperspectral SWIR band (80 m/px) co-registered to NASA LRO NAC panchromatic reference base.',
      sourceMeta: {
        sensorType: 'CH2_IIRS',
        sunElevation: 35.0,
        resolution: 80.0,
        phaseAngle: 55.0,
        centerCoordinates: { lat: 20.5, lon: -20.6 },
        imageName: 'CH2_IIRS_SWIR_20230219_IMBRIUM.tif',
        previewUrl: mareSrcImg
      },
      referenceMeta: {
        sensorType: 'LRO_NAC',
        sunElevation: 48.0,
        resolution: 0.50,
        phaseAngle: 42.0,
        centerCoordinates: { lat: 20.5, lon: -20.6 },
        imageName: 'LRO_NAC_M102948271LE_IMBRIUM.tif',
        previewUrl: mareRefImg
      },
      sourceSvgOrCanvas: mareSrcImg,
      refSvgOrCanvas: mareRefImg
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

// Initial historical mission runs
export function getInitialHistoricalRuns(): HistoricalRun[] {
  const presets = getPresetScenarios();
  
  const shackletonData = generateKeypointDataset(600, 600, 420, 0.89, 101);
  const tychoData = generateKeypointDataset(600, 600, 310, 0.84, 202);
  const mareData = generateKeypointDataset(600, 600, 275, 0.91, 303);

  return [
    {
      id: 'RUN-2026-CH2-0884',
      title: 'Shackleton Crater South Pole High-Res Co-Registration',
      targetFeature: 'PSR Crater Rim & Slope Analysis',
      timestamp: '2026-09-10 14:32:19 UTC',
      sourceMeta: presets[0].sourceMeta,
      referenceMeta: presets[0].referenceMeta,
      metrics: shackletonData.metrics,
      keypoints: shackletonData.keypoints
    },
    {
      id: 'RUN-2026-CH2-0879',
      title: 'Tycho Crater Central Peak Stereo DEM Alignment',
      targetFeature: 'Central Uplift & Terraced Slopes',
      timestamp: '2026-09-08 09:15:40 UTC',
      sourceMeta: presets[1].sourceMeta,
      referenceMeta: presets[1].referenceMeta,
      metrics: tychoData.metrics,
      keypoints: tychoData.keypoints
    },
    {
      id: 'RUN-2026-CH2-0872',
      title: 'Mare Imbrium Basalt Plain Hyperspectral Calibration',
      targetFeature: 'Pytheas Impact Ejecta',
      timestamp: '2026-09-04 18:48:02 UTC',
      sourceMeta: presets[2].sourceMeta,
      referenceMeta: presets[2].referenceMeta,
      metrics: mareData.metrics,
      keypoints: mareData.keypoints
    }
  ];
}
