export type SensorType = 
  | 'CH2_OHRC' 
  | 'CH2_TMC' 
  | 'CH2_IIRS' 
  | 'LRO_NAC' 
  | 'LRO_WAC' 
  | 'CLEMENTINE' 
  | 'OTHER';

export interface SensorInfo {
  id: SensorType;
  name: string;
  mission: 'Chandrayaan-2' | 'NASA LRO' | 'NASA Clementine' | 'Custom';
  nominalGsd: number; // meters/pixel
  band: string;
  description: string;
}

export interface ImageMetadata {
  sensorType: SensorType;
  sunElevation: number; // degrees 0-90
  resolution: number; // m/pixel
  phaseAngle: number; // degrees
  centerCoordinates: {
    lat: number;
    lon: number;
  };
  imageName: string;
  previewUrl?: string;
  customFile?: File;
}

export interface KeypointMatch {
  id: number;
  srcX: number;
  srcY: number;
  refX: number;
  refY: number;
  residualError: number; // in pixels
  confidence: number; // 0.0 to 1.0
  isInlier: boolean;
  tileIndex: number; // 0 to 63 for 8x8 grid
}

export interface TileHeatmapCell {
  row: number;
  col: number;
  matchCount: number;
  inlierCount: number;
  densityScore: number; // 0 to 1.0
}

export interface PipelineStageInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  durationMs: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  telemetryLogs: string[];
}

export interface RegistrationMetrics {
  rmseTotal: number;
  rmseX: number;
  rmseY: number;
  inlierRatio: number; // percentage e.g. 87.4
  totalMatches: number;
  inlierMatches: number;
  spatialCoverage: number; // percentage e.g. 92.5
  confidenceScore: number; // percentage e.g. 96.2
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  processingTimeTotalMs: number;
  stageTimings: {
    stage: string;
    timeMs: number;
    color: string;
  }[];
  homographyMatrix: number[][]; // 3x3 matrix
  tileHeatmap: TileHeatmapCell[][];
}

export interface PresetScenario {
  id: string;
  title: string;
  targetFeature: string;
  location: string;
  difficulty: 'Standard' | 'High Illumination Delta' | 'Extreme Scale Variation';
  description: string;
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  sourceSvgOrCanvas: string; // procedural image id
  refSvgOrCanvas: string;
}

export interface HistoricalRun {
  id: string;
  title: string;
  targetFeature: string;
  timestamp: string;
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  metrics: RegistrationMetrics;
  keypoints: KeypointMatch[];
}
