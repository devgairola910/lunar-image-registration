import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  RotateCcw,
} from 'lucide-react';
import type { HistoricalRun } from '../../types/registration';

interface HistoryViewProps {
  runs: HistoricalRun[];
  onLoadRun: (run: HistoricalRun) => void;
  onNewRun: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  runs,
  onLoadRun,
  onNewRun
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sensorFilter, setSensorFilter] = useState<string>('ALL');

  const filteredRuns = runs.filter((run) => {
    const matchesSearch =
      run.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.targetFeature.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSensor =
      sensorFilter === 'ALL' ||
      run.sourceMeta.sensorType === sensorFilter ||
      run.referenceMeta.sensorType === sensorFilter;

    return matchesSearch && matchesSensor;
  });

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="text-regolith-400 font-mono text-xs uppercase tracking-wider mb-1">
            MISSION ARCHIVE // HISTORICAL TELEMETRY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Past Registration Runs
          </h2>
          <p className="text-xs sm:text-sm text-regolith-400">
            Review past co-registration missions, inspect residuals, or reload into the active console.
          </p>
        </div>

        <button
          onClick={onNewRun}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-regolith-200 text-black font-mono text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Launch New Mission</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        {/* Sensor Filter Pills */}
        <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-obsidian-950 border border-white/10 overflow-x-auto">
          {['ALL', 'CH2_OHRC', 'CH2_TMC', 'CH2_IIRS'].map((sensor) => (
            <button
              key={sensor}
              onClick={() => setSensorFilter(sensor)}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                sensorFilter === sensor
                  ? 'bg-regolith-800 text-white font-bold'
                  : 'text-regolith-400 hover:text-white'
              }`}
            >
              {sensor === 'ALL' ? 'All Sensors' : sensor}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-regolith-500" />
          <input
            type="text"
            placeholder="Search run ID, target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-white focus:outline-none focus:border-white/30 placeholder:text-regolith-600"
          />
        </div>
      </div>

      {/* Historical Runs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRuns.map((run) => (
          <div
            key={run.id}
            onClick={() => onLoadRun(run)}
            className="group cursor-pointer rounded-xl p-5 mission-card hover:mission-card-glow border border-white/10 hover:border-white/30 transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[10px] px-2 py-0.5 rounded bg-black text-regolith-300 border border-white/10">
                  {run.id}
                </span>
                <span className="text-[10px] text-telemetry-green font-semibold tracking-wider">
                  VERIFIED
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-regolith-200 transition-colors font-display">
                  {run.title}
                </h3>
                <p className="text-xs text-regolith-400 font-mono mt-0.5">
                  Target: {run.targetFeature}
                </p>
              </div>

              {/* Authentic Orbital Imagery Dual-Thumbnail Preview */}
              <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black border border-white/10 flex">
                <div className="relative w-1/2 h-full border-r border-white/10 overflow-hidden bg-obsidian-950">
                  <img
                    src={run.sourceMeta.previewUrl || '/lunar_clavius_source.png'}
                    alt="Source lunar sensor frame"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/80 text-regolith-200 border border-white/10">
                      SRC: {run.sourceMeta.sensorType.replace('CH2_', '')}
                    </span>
                  </div>
                </div>
                <div className="relative w-1/2 h-full overflow-hidden bg-obsidian-950">
                  <img
                    src={run.referenceMeta.previewUrl || '/lunar_clavius_reference.png'}
                    alt="Reference lunar base frame"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/80 text-regolith-200 border border-white/10">
                      REF: {run.referenceMeta.sensorType.replace('CH2_', '').replace('ISRO_', '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sensor Pair */}
              <div className="p-2.5 rounded-lg bg-obsidian-950 border border-white/5 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-regolith-500">SOURCE:</span>
                  <span className="text-white font-bold">{run.sourceMeta.sensorType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-regolith-500">REFERENCE:</span>
                  <span className="text-white font-bold">{run.referenceMeta.sensorType}</span>
                </div>
              </div>

              {/* Key Metrics Summary */}
              <div className="grid grid-cols-3 gap-2 font-mono text-center pt-1">
                <div className="p-2 rounded bg-obsidian-950 border border-white/5">
                  <div className="text-[9px] text-regolith-500">RMSE</div>
                  <div className="text-sm font-bold text-telemetry-green mt-0.5">
                    {run.metrics.rmseTotal} px
                  </div>
                </div>
                <div className="p-2 rounded bg-obsidian-950 border border-white/5">
                  <div className="text-[9px] text-regolith-500">INLIERS</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {run.metrics.inlierRatio}%
                  </div>
                </div>
                <div className="p-2 rounded bg-obsidian-950 border border-white/5">
                  <div className="text-[9px] text-regolith-500">SCORE</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {run.metrics.confidenceScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action link */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs text-regolith-400 group-hover:text-white">
              <span>Open in Verification Viewport</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
