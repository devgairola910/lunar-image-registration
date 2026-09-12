import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  SlidersHorizontal, 
  Columns, 
  Layers, 
  Grid, 
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';

export type ViewMode = 'split' | 'sideBySide' | 'blend' | 'difference' | 'vectors';

interface ViewerControlsProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  showKeypoints: boolean;
  onToggleKeypoints: () => void;
  keypointFilter: 'all' | 'inliers' | 'outliers';
  onChangeKeypointFilter: (filter: 'all' | 'inliers' | 'outliers') => void;
  showTileGrid: boolean;
  onToggleTileGrid: () => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  blendOpacity: number;
  onChangeBlendOpacity: (val: number) => void;
  splitPosition: number;
  onChangeSplitPosition: (val: number) => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  viewMode,
  onChangeViewMode,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  showKeypoints,
  onToggleKeypoints,
  keypointFilter,
  onChangeKeypointFilter,
  showTileGrid,
  onToggleTileGrid,
  showHeatmap,
  onToggleHeatmap,
  blendOpacity,
  onChangeBlendOpacity,
  splitPosition,
  onChangeSplitPosition
}) => {
  const modes: { id: ViewMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'split', label: 'Split Slider', icon: SlidersHorizontal },
    { id: 'sideBySide', label: 'Side-by-Side', icon: Columns },
    { id: 'blend', label: 'Overlay Blend', icon: Layers },
    { id: 'vectors', label: 'Match Vectors', icon: Activity },
    { id: 'difference', label: 'Difference Mask', icon: Grid },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-obsidian-900 border border-white/10 backdrop-blur-md text-xs font-mono">
      {/* View Mode Selector Buttons */}
      <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-obsidian-950 border border-white/10 overflow-x-auto">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = viewMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChangeViewMode(m.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-regolith-800 text-white border border-white/20 font-semibold shadow-sm'
                  : 'text-regolith-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode-specific Sliders */}
      {viewMode === 'blend' && (
        <div className="flex items-center space-x-2 px-3 py-1 bg-obsidian-950 rounded-lg border border-white/10">
          <span className="text-regolith-400">Blend:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(blendOpacity * 100)}
            onChange={(e) => onChangeBlendOpacity(parseFloat(e.target.value) / 100)}
            className="w-24 accent-white h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white font-bold w-8 text-right">{Math.round(blendOpacity * 100)}%</span>
        </div>
      )}

      {viewMode === 'split' && (
        <div className="flex items-center space-x-2 px-3 py-1 bg-obsidian-950 rounded-lg border border-white/10">
          <span className="text-regolith-400">Split Wipe:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(splitPosition * 100)}
            onChange={(e) => onChangeSplitPosition(parseFloat(e.target.value) / 100)}
            className="w-24 accent-white h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white font-bold w-8 text-right">{Math.round(splitPosition * 100)}%</span>
        </div>
      )}

      {/* Overlay Toggles */}
      <div className="flex items-center space-x-2">
        {/* Keypoints Toggle */}
        <div className="flex items-center rounded-lg bg-obsidian-950 border border-white/10 p-0.5">
          <button
            onClick={onToggleKeypoints}
            title="Toggle Keypoints Overlay"
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-all cursor-pointer ${
              showKeypoints
                ? 'bg-white/10 text-white font-semibold'
                : 'text-regolith-500 hover:text-regolith-300'
            }`}
          >
            {showKeypoints ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Points</span>
          </button>

          {showKeypoints && (
            <div className="flex items-center pl-1 border-l border-white/10 text-[10px]">
              {(['all', 'inliers', 'outliers'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => onChangeKeypointFilter(filter)}
                  className={`px-1.5 py-0.5 rounded uppercase cursor-pointer ${
                    keypointFilter === filter
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-regolith-500 hover:text-regolith-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tile Grid Toggle */}
        <button
          onClick={onToggleTileGrid}
          title="Toggle 8x8 Tile Partition Grid"
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            showTileGrid
              ? 'bg-white/10 text-white border-white/30'
              : 'bg-obsidian-950 text-regolith-500 border-white/10 hover:text-regolith-300'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        {/* Heatmap Toggle */}
        <button
          onClick={onToggleHeatmap}
          title="Toggle Spatial Coverage Heatmap"
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            showHeatmap
              ? 'bg-white/10 text-white border-white/30'
              : 'bg-obsidian-950 text-regolith-500 border-white/10 hover:text-regolith-300'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 pl-2 border-l border-white/10">
          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-obsidian-950 text-regolith-400 hover:text-white border border-white/10 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-regolith-200 w-9 text-center font-bold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-obsidian-950 text-regolith-400 hover:text-white border border-white/10 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            title="Reset Zoom & Pan"
            className="p-1.5 rounded-lg bg-obsidian-950 text-regolith-400 hover:text-white border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
