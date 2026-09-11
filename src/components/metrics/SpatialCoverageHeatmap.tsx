import React, { useState } from 'react';
import type { TileHeatmapCell } from '../../types/registration';
import { ReticleFrame } from '../common/ReticleFrame';
import { Maximize2, CheckCircle2 } from 'lucide-react';

interface SpatialCoverageHeatmapProps {
  heatmap: TileHeatmapCell[][];
  spatialCoverage: number;
}

export const SpatialCoverageHeatmap: React.FC<SpatialCoverageHeatmapProps> = ({
  heatmap,
  spatialCoverage
}) => {
  const [hoveredCell, setHoveredCell] = useState<TileHeatmapCell | null>(null);

  return (
    <ReticleFrame
      title="Spatial Uniformity Matrix"
      badge="8×8 PARTITION"
      badgeColor="teal"
      headerRight={
        <div className="flex items-center space-x-1.5 text-xs font-mono text-telemetry-green font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{spatialCoverage}% COVERED</span>
        </div>
      }
    >
      <div className="space-y-3 font-mono text-xs">
        <p className="text-[11px] text-regolith-400">
          Enforces uniform keypoint distribution across deep shadows, preventing feature starvation in dark crater floors.
        </p>

        {/* 8x8 Interactive Grid */}
        <div className="aspect-square w-full max-w-[280px] mx-auto grid grid-cols-8 gap-1 p-2 rounded-lg bg-black border border-white/10 shadow-inner">
          {heatmap.flatMap((row, rIdx) =>
            row.map((cell, cIdx) => {
              const hasData = cell.matchCount > 0;
              const isInlierSolid = cell.inlierCount >= 3;
              
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`relative rounded-sm transition-all duration-150 cursor-pointer flex items-center justify-center ${
                    !hasData
                      ? 'bg-obsidian-900/60 border border-white/5'
                      : isInlierSolid
                      ? 'bg-emerald-500/70 hover:bg-emerald-400 border border-emerald-400'
                      : 'bg-emerald-500/30 hover:bg-emerald-500/50 border border-emerald-500/40'
                  }`}
                  style={{
                    opacity: hasData ? Math.max(0.35, cell.densityScore) : 0.2
                  }}
                >
                  <span className="text-[9px] font-bold text-black select-none opacity-0 hover:opacity-100">
                    {cell.matchCount}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Hover Readout / Legend */}
        <div className="p-2 rounded-lg bg-obsidian-950 border border-white/5 flex items-center justify-between text-[11px] text-regolith-300">
          {hoveredCell ? (
            <div className="flex items-center justify-between w-full">
              <span>
                Tile [{hoveredCell.row},{hoveredCell.col}]:
              </span>
              <span className="text-telemetry-green font-bold">
                {hoveredCell.inlierCount} Inliers / {hoveredCell.matchCount} Total
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-regolith-500">
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Hover tile
              </span>
              <div className="flex items-center space-x-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-500"></span> High
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-500/30"></span> Low
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-obsidian-900 border border-white/10"></span> Empty
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ReticleFrame>
  );
};
