import React, { useState } from 'react';
import { 
  FileText, 
  RotateCcw, 
  Layers, 
  FileSpreadsheet, 
  CheckCircle2, 
  Compass,
} from 'lucide-react';
import { ReticleFrame } from '../common/ReticleFrame';
import { LunarCanvasViewer } from '../viewer/LunarCanvasViewer';
import { ViewerControls } from '../viewer/ViewerControls';
import type { ViewMode } from '../viewer/ViewerControls';
import { MetricsGrid } from '../metrics/MetricsGrid';
import { SpatialCoverageHeatmap } from '../metrics/SpatialCoverageHeatmap';
import { KeypointsTable } from '../metrics/KeypointsTable';
import { EvaluationReportModal } from '../export/EvaluationReportModal';
import type { 
  RegistrationMetrics, 
  KeypointMatch, 
  ImageMetadata 
} from '../../types/registration';
import { 
  downloadKeypointsCSV, 
  downloadSimulatedGeoTIFF, 
} from '../../utils/exportUtils';
import { soundFx } from '../../utils/soundEffects';

interface ResultsViewProps {
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  metrics: RegistrationMetrics;
  keypoints: KeypointMatch[];
  onStartNewRun: () => void;
  onViewHistory: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  sourceMeta,
  referenceMeta,
  metrics,
  keypoints,
  onStartNewRun,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [zoom, setZoom] = useState(1.0);
  const [showKeypoints, setShowKeypoints] = useState(true);
  const [keypointFilter, setKeypointFilter] = useState<'all' | 'inliers' | 'outliers'>('all');
  const [showTileGrid, setShowTileGrid] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [blendOpacity, setBlendOpacity] = useState(0.5);
  const [splitPosition, setSplitPosition] = useState(0.5);
  const [selectedKeypointId, setSelectedKeypointId] = useState<number | undefined>(undefined);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadCSV = () => {
    soundFx.playClick();
    downloadKeypointsCSV(keypoints, sourceMeta, referenceMeta);
    showToast('Match points exported successfully to CSV.');
  };

  const handleDownloadGeoTIFF = () => {
    soundFx.playClick();
    downloadSimulatedGeoTIFF(sourceMeta, metrics);
    showToast('Registered orthorectified image & worldfile (.tfw) generated.');
  };

  const handleOpenReport = () => {
    soundFx.playClick();
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-obsidian-900 border border-white/20 text-white font-mono text-xs shadow-2xl flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-telemetry-green flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-regolith-400 font-mono text-xs uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-telemetry-green animate-pulse"></span>
            <span>Registration Sequence Locked // Sub-Pixel Convergence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Results & Verification Dashboard
          </h2>
          <p className="text-xs sm:text-sm font-mono text-regolith-400">
            Source: <strong className="text-white">{sourceMeta.sensorType}</strong> ({sourceMeta.resolution}m/px) ↔ Reference: <strong className="text-white">{referenceMeta.sensorType}</strong> ({referenceMeta.resolution}m/px)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenReport}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 border border-white/15 text-xs font-mono text-regolith-200 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-regolith-300" />
            <span>Mission Report</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onStartNewRun();
            }}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white hover:bg-regolith-200 text-black font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Ingestion Run</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Multi-Mode Lunar Image Viewport */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold font-mono tracking-wider text-regolith-300 uppercase flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-regolith-200" />
            <span>Interactive Georeferencing Viewport</span>
          </h3>
          <span className="text-[11px] font-mono text-regolith-500">
            Split Wipe, Side-by-Side, Overlay Blending & Keypoint Vectors
          </span>
        </div>

        {/* Viewer Controls Toolbar */}
        <ViewerControls
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          zoom={zoom}
          onZoomIn={() => setZoom(z => Math.min(3.0, parseFloat((z + 0.25).toFixed(2))))}
          onZoomOut={() => setZoom(z => Math.max(0.5, parseFloat((z - 0.25).toFixed(2))))}
          onResetZoom={() => setZoom(1.0)}
          showKeypoints={showKeypoints}
          onToggleKeypoints={() => setShowKeypoints(!showKeypoints)}
          keypointFilter={keypointFilter}
          onChangeKeypointFilter={setKeypointFilter}
          showTileGrid={showTileGrid}
          onToggleTileGrid={() => setShowTileGrid(!showTileGrid)}
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
          blendOpacity={blendOpacity}
          onChangeBlendOpacity={setBlendOpacity}
          splitPosition={splitPosition}
          onChangeSplitPosition={setSplitPosition}
        />

        {/* Interactive Canvas */}
        <LunarCanvasViewer
          sourceMeta={sourceMeta}
          referenceMeta={referenceMeta}
          keypoints={keypoints}
          tileHeatmap={metrics.tileHeatmap}
          viewMode={viewMode}
          zoom={zoom}
          showKeypoints={showKeypoints}
          keypointFilter={keypointFilter}
          showTileGrid={showTileGrid}
          showHeatmap={showHeatmap}
          blendOpacity={blendOpacity}
          splitPosition={splitPosition}
          onSplitPositionChange={setSplitPosition}
          selectedKeypointId={selectedKeypointId}
          onSelectKeypoint={setSelectedKeypointId}
          onZoomChange={setZoom}
        />
      </div>

      {/* SECTION 2: Analytics Grid & Spatial Uniformity Heatmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="text-xs font-bold font-mono tracking-wider text-regolith-300 uppercase">
            Geometric Telemetry & Error Metrics
          </h3>
          <span className="text-xs font-mono text-regolith-400 font-semibold">
            MAGSAC++ BOUND: &lt; 0.80 PX
          </span>
        </div>

        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            <SpatialCoverageHeatmap
              heatmap={metrics.tileHeatmap}
              spatialCoverage={metrics.spatialCoverage}
            />
          </div>

          <div className="lg:col-span-2">
            {/* Export Hub Card */}
            <ReticleFrame
              title="Mission Data & Georeferenced Export Hub"
              badge="OUTPUT PACKAGE"
              badgeColor="neutral"
            >
              <div className="space-y-4 font-mono text-xs">
                <p className="text-regolith-300">
                  Export certified registration coordinates, GeoTIFF orthorectified image rasters, and full JSON telemetry for planetary GIS systems (QGIS / ArcGIS / USGS ISIS3).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="p-3.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 border border-white/10 hover:border-white/25 text-left transition-all group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FileSpreadsheet className="w-5 h-5 text-regolith-200" />
                      <span className="text-[9px] text-regolith-500">CSV DATA</span>
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        Match Points (CSV)
                      </div>
                      <div className="text-[10px] text-regolith-500">
                        {keypoints.length} vectors & residuals
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadGeoTIFF}
                    className="p-3.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 border border-white/10 hover:border-white/25 text-left transition-all group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Layers className="w-5 h-5 text-regolith-200" />
                      <span className="text-[9px] text-regolith-500">GEOTIFF + TFW</span>
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        Registered Raster
                      </div>
                      <div className="text-[10px] text-regolith-500">
                        Orthorectified GeoTIFF package
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleOpenReport}
                    className="p-3.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 border border-white/10 hover:border-white/25 text-left transition-all group flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="w-5 h-5 text-regolith-200" />
                      <span className="text-[9px] text-regolith-500">FORMAL PDF</span>
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        Evaluation Report
                      </div>
                      <div className="text-[10px] text-regolith-500">
                        Geodetic Certificate
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </ReticleFrame>
          </div>
        </div>
      </div>

      {/* SECTION 3: Keypoints Telemetry Table */}
      <KeypointsTable
        keypoints={keypoints}
        selectedKeypointId={selectedKeypointId}
        onSelectKeypoint={setSelectedKeypointId}
      />

      {/* Evaluation Report Modal */}
      <EvaluationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        metrics={metrics}
        sourceMeta={sourceMeta}
        referenceMeta={referenceMeta}
        keypoints={keypoints}
      />
    </div>
  );
};
