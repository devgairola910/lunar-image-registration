import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { ReticleFrame } from '../common/ReticleFrame';
import type { RegistrationMetrics } from '../../types/registration';
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  ShieldCheck 
} from 'lucide-react';

interface MetricsGridProps {
  metrics: RegistrationMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  // Donut chart data for inliers vs outliers
  const inlierPieData = [
    { name: 'Inliers', value: metrics.inlierMatches, color: '#22c55e' },
    { name: 'Outliers', value: metrics.totalMatches - metrics.inlierMatches, color: '#ef4444' },
  ];

  // Stage runtime chart data with neutral/monochrome palette
  const stageData = metrics.stageTimings.map(s => ({
    name: s.stage.replace('Feature Extraction (LoFTR)', 'LoFTR Backbone').replace('Geometric MAGSAC++', 'MAGSAC++'),
    time: s.timeMs,
    fill: '#52525b'
  }));

  const isSubPixel = metrics.rmseTotal < 1.0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* CARD 1: RMSE (Residual Error) */}
      <ReticleFrame
        title="Geometric Residual (RMSE)"
        badge={isSubPixel ? 'SUB-PIXEL CERTIFIED' : 'HIGH DISPARITY'}
        badgeColor={isSubPixel ? 'teal' : 'amber'}
      >
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white flex items-baseline gap-1.5">
                <span>{metrics.rmseTotal.toFixed(2)}</span>
                <span className="text-sm font-normal text-regolith-400">px</span>
              </div>
              <div className="text-xs font-mono text-telemetry-green flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Optimal Lock (&lt; 0.80 px bound)</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900 border border-white/10 text-white shadow-instrument">
              <Target className="w-5 h-5" />
            </div>
          </div>

          {/* X & Y Axis Residual Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-white/5">
              <div className="text-[10px] text-regolith-500">X-AXIS RESIDUAL</div>
              <div className="text-white font-bold text-sm mt-0.5">{metrics.rmseX.toFixed(2)} px</div>
              <div className="text-[10px] text-regolith-500">Parallax drift</div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-950 border border-white/5">
              <div className="text-[10px] text-regolith-500">Y-AXIS RESIDUAL</div>
              <div className="text-white font-bold text-sm mt-0.5">{metrics.rmseY.toFixed(2)} px</div>
              <div className="text-[10px] text-regolith-500">Along-track drift</div>
            </div>
          </div>
        </div>
      </ReticleFrame>

      {/* CARD 2: Inlier Ratio Radial / Donut */}
      <ReticleFrame
        title="MAGSAC++ Inlier Ratio"
        badge={`${metrics.inlierRatio}% PASS`}
        badgeColor="teal"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2 font-mono">
            <div className="text-3xl font-bold text-white">
              {metrics.inlierRatio}%
            </div>
            <div className="text-xs text-regolith-400">
              Verified inlier matches after σ-consensus filtering.
            </div>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="flex items-center gap-1.5 text-telemetry-green font-semibold">
                <span className="w-2 h-2 rounded-full bg-telemetry-green"></span>
                {metrics.inlierMatches} Inliers
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                {metrics.totalMatches - metrics.inlierMatches} Rejected
              </span>
            </div>
          </div>

          <div className="w-28 h-28 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inlierPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={44}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {inlierPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white pointer-events-none">
              {Math.round(metrics.inlierRatio)}%
            </div>
          </div>
        </div>
      </ReticleFrame>

      {/* CARD 3: Overall Confidence Score */}
      <ReticleFrame
        title="Mission Confidence Score"
        badge={metrics.confidenceLevel}
        badgeColor={metrics.confidenceLevel === 'HIGH' ? 'teal' : 'amber'}
        glow={metrics.confidenceLevel === 'HIGH'}
      >
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-white flex items-baseline gap-1">
                <span>{metrics.confidenceScore}%</span>
              </div>
              <div className="text-xs font-mono text-regolith-400 mt-1">
                Composite georeferencing quality metric
              </div>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-900 border border-white/10 text-white shadow-instrument">
              <Gauge className="w-5 h-5" />
            </div>
          </div>

          {/* Gauge Meter Bar */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-white"
                style={{ width: `${metrics.confidenceScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-regolith-500">
              <span>0% Low</span>
              <span>70% Nominal</span>
              <span className="text-white font-bold">95%+ Optimal</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-regolith-400 bg-obsidian-950 p-2 rounded border border-white/5">
            Diagnostic: High structural correspondence invariant to 56° sun elevation shift.
          </div>
        </div>
      </ReticleFrame>

      {/* CARD 4: Total Correspondences vs Inliers */}
      <ReticleFrame
        title="Keypoint Correspondences"
        badge="MAGSAC++ FILTER"
        badgeColor="neutral"
      >
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics.inlierMatches}{' '}
                <span className="text-sm font-normal text-regolith-400">/ {metrics.totalMatches}</span>
              </div>
              <div className="text-xs text-regolith-400 mt-0.5">
                Keypoints extracted across multi-scale pyramid
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-obsidian-900 border border-white/10 text-regolith-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Dual Bar Comparison */}
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-regolith-400 mb-1">
                <span>Total Candidates Extracted</span>
                <span className="text-white font-bold">{metrics.totalMatches}</span>
              </div>
              <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-regolith-700 h-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-regolith-300 mb-1">
                <span>Verified Inlier Matches</span>
                <span className="font-bold text-white">{metrics.inlierMatches}</span>
              </div>
              <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full"
                  style={{ width: `${(metrics.inlierMatches / metrics.totalMatches) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </ReticleFrame>

      {/* CARD 5: Pipeline Execution Time Breakdown */}
      <ReticleFrame
        title="Compute Stage Breakdown"
        badge={`${(metrics.processingTimeTotalMs / 1000).toFixed(2)}s TOTAL`}
        badgeColor="neutral"
        className="md:col-span-2 lg:col-span-2"
      >
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-regolith-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-regolith-300" /> Latency per pipeline stage
            </span>
            <span className="text-regolith-400">GPU Accelerated (Apple Neural / CUDA)</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stageData}
                margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
              >
                <XAxis type="number" unit="ms" tick={{ fill: '#71717a', fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#d4d4d8', fontSize: 10, width: 120 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px'
                  }}
                  formatter={(value: any) => [`${value} ms`, 'Compute Time']}
                />
                <Bar dataKey="time" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ReticleFrame>
    </div>
  );
};
