import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  FastForward, 
  SunMedium, 
  Maximize2, 
  Target 
} from 'lucide-react';
import { ReticleFrame } from '../common/ReticleFrame';
import type { PipelineStageInfo, RegistrationMetrics, ImageMetadata } from '../../types/registration';
import { soundFx } from '../../utils/soundEffects';

interface ProcessingViewProps {
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  onComplete: () => void;
  metrics: RegistrationMetrics;
}

const STAGES: Omit<PipelineStageInfo, 'status'>[] = [
  {
    id: 'stage_1',
    name: 'Metadata-Aware Preprocessing',
    subtitle: 'SPICE Kernels & Radiometric Normalization',
    description: 'Loading orbital ephemeris, calculating phase angle geometry, and equalizing extreme solar illumination differences.',
    durationMs: 1400,
    telemetryLogs: [
      'Loading NAIF SPICE kernels: CH2_ORBITER_V04.BSP, LRO_NO_ASPS_2022.BSP...',
      'Ephemeris sync verified: Coordinate Frame MOON_ME (IAU 2015).',
      'Computing solar phase angle delta: Source (12.0°) vs Ref (68.0°) = Δ 56.0°.',
      'Applying radiometric photometric correction & dark shadow masking.'
    ]
  },
  {
    id: 'stage_2',
    name: 'Modality-Adaptive Feature Matching',
    subtitle: 'LoFTR / SuperPoint Transformer Backbone',
    description: 'Dense multi-scale attention matching robust to cross-sensor spectral and scale variations.',
    durationMs: 1600,
    telemetryLogs: [
      'Initializing LoFTR-Lunar neural correspondence backbone (PyTorch JIT)...',
      'Multi-scale feature pyramid decomposition (Level 0: 600x600, Level 1: 300x300)...',
      'Extracted 1,420 raw candidate keypoint pairs across detector planes.',
      'Mutual nearest-neighbor cross-check applied. Initial matches: 412 pairs.'
    ]
  },
  {
    id: 'stage_3',
    name: 'Tile-Based Matching for Coverage',
    subtitle: '8x8 Uniform Spatial Grid Partitioning',
    description: 'Partitioning the lunar frame into 64 spatial tiles to enforce uniform keypoint density across shadows.',
    durationMs: 1300,
    telemetryLogs: [
      'Partitioning image domain into 8x8 spatial tiles (64 regions total)...',
      'Balancing keypoint density: Suppressing crater rim clusters, boosting flat maria...',
      'Spatial coverage evaluated: 60 of 64 tiles populated with valid candidates.',
      'Uniform spatial distribution verified: 93.8% tile coverage.'
    ]
  },
  {
    id: 'stage_4',
    name: 'Robust Geometric Estimation',
    subtitle: 'MAGSAC++ Epipolar & Homography Optimization',
    description: 'Marginalizing Sample Consensus to eliminate shadow edge outliers and fit precise 3x3 homography.',
    durationMs: 1500,
    telemetryLogs: [
      'Executing MAGSAC++ robust projective estimator (Max iterations: 2,500)...',
      'Iterative σ-consensus scoring: Inlier threshold dynamic bound = 1.50 px.',
      'Filtering shadow-displacement artifacts & crater-wall geometric parallax...',
      'MAGSAC++ converged in 1,840 iterations: 360 Inliers, 52 Outliers rejected (87.4% inliers).'
    ]
  },
  {
    id: 'stage_5',
    name: 'Sub-Pixel Refinement & Scoring',
    subtitle: 'Covariance Fitting & Quality Certification',
    description: 'Parabolic 2D surface interpolation achieving sub-pixel precision and computing final telemetry covariance.',
    durationMs: 1200,
    telemetryLogs: [
      'Performing 2D parabolic quadratic surface peak interpolation...',
      'Sub-pixel residual error: RMSE X = 0.45 px, RMSE Y = 0.51 px, Total RMSE = 0.68 px.',
      'Confidence Matrix evaluation: Grade = OPTIMAL LOCK (96.2%).',
      'Registration sequence certified. Outputting georeferenced transformation matrix.'
    ]
  }
];

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  sourceMeta,
  referenceMeta,
  onComplete,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Main Pipeline Step Execution Engine
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let progressInterval: ReturnType<typeof setInterval>;

    const runStage = (stageIdx: number) => {
      if (stageIdx >= STAGES.length) {
        soundFx.playSuccessLock();
        setTimeout(() => {
          onComplete();
        }, 600);
        return;
      }

      setCurrentStageIdx(stageIdx);
      setStageProgress(0);

      const stage = STAGES[stageIdx];
      const stageStart = Date.now();

      // Stream logs for this stage
      stage.telemetryLogs.forEach((logText, logIdx) => {
        setTimeout(() => {
          const elapsedSec = ((Date.now() - startTimeRef.current) / 1000).toFixed(2);
          setLogs(prev => [...prev, `[T+${elapsedSec}s] [${stage.name.split(' ')[0].toUpperCase()}] ${logText}`]);
        }, logIdx * (stage.durationMs / stage.telemetryLogs.length));
      });

      // Animate progress percentage
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - stageStart;
        const pct = Math.min(100, Math.round((elapsed / stage.durationMs) * 100));
        setStageProgress(pct);
      }, 50);

      // Advance to next stage
      timer = setTimeout(() => {
        clearInterval(progressInterval);
        setStageProgress(100);
        soundFx.playStageComplete();
        runStage(stageIdx + 1);
      }, stage.durationMs);
    };

    runStage(0);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const handleSkip = () => {
    soundFx.playClick();
    soundFx.playSuccessLock();
    onComplete();
  };

  const getStageIcon = (idx: number) => {
    const icons = [SunMedium, Cpu, Maximize2, ShieldCheck, Target];
    const Icon = icons[idx] || Cpu;
    return <Icon className="w-4 h-4" />;
  };

  const overallProgress = Math.min(
    100,
    Math.round(((currentStageIdx * 100 + stageProgress) / (STAGES.length * 100)) * 100)
  );

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header telemetry banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-regolith-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Active Pipeline Execution // Real-Time Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Processing Lunar Pipeline
          </h2>
          <p className="text-xs font-mono text-regolith-400">
            {sourceMeta.sensorType} ({sourceMeta.resolution}m) ➔ {referenceMeta.sensorType} ({referenceMeta.resolution}m)
          </p>
        </div>

        {/* Action button: Skip to results */}
        <button
          onClick={handleSkip}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 border border-white/15 text-xs font-mono text-regolith-300 hover:text-white transition-all self-start sm:self-auto cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5 text-regolith-200" />
          <span>Fast-Forward to Results</span>
        </button>
      </div>

      {/* Global Progress Bar */}
      <div className="p-4 rounded-xl mission-card border border-white/10 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-regolith-300">
            STAGE {Math.min(STAGES.length, currentStageIdx + 1)} OF {STAGES.length}:{' '}
            <strong className="text-white">
              {STAGES[Math.min(STAGES.length - 1, currentStageIdx)].name}
            </strong>
          </span>
          <span className="text-white font-bold">{overallProgress}%</span>
        </div>
        <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="bg-white h-full transition-all duration-150"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* 5-Stage Visual Pipeline Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIdx;
          const isActive = idx === currentStageIdx;

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl p-4 transition-all duration-200 border flex flex-col justify-between ${
                isActive
                  ? 'mission-card-glow border-white/40 shadow-instrument'
                  : isCompleted
                  ? 'bg-obsidian-900 border-white/20 text-regolith-200'
                  : 'bg-obsidian-950 border-white/5 text-regolith-600 opacity-50'
              }`}
            >
              <div className="space-y-2">
                {/* Node Status Indicator */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold opacity-60">0{idx + 1}</span>
                  {isCompleted ? (
                    <div className="flex items-center space-x-1 text-telemetry-green">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">DONE</span>
                    </div>
                  ) : isActive ? (
                    <div className="flex items-center space-x-1 text-white font-bold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-[10px]">{stageProgress}%</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-regolith-600">WAITING</span>
                  )}
                </div>

                {/* Stage Header */}
                <div className="flex items-center space-x-2 pt-1">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : isCompleted
                        ? 'bg-white/5 text-regolith-200'
                        : 'bg-obsidian-900 text-regolith-600'
                    }`}
                  >
                    {getStageIcon(idx)}
                  </div>
                  <h4
                    className={`text-xs font-bold font-display leading-tight ${
                      isActive ? 'text-white' : isCompleted ? 'text-regolith-200' : 'text-regolith-500'
                    }`}
                  >
                    {stage.name}
                  </h4>
                </div>

                <p className="text-[10px] text-regolith-400 leading-tight font-mono">
                  {stage.subtitle}
                </p>
              </div>

              {/* Mini stage progress bar */}
              <div className="mt-3 pt-2 border-t border-white/5">
                <div className="w-full bg-obsidian-950 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-75 ${
                      isCompleted
                        ? 'bg-telemetry-green w-full'
                        : isActive
                        ? 'bg-white'
                        : 'w-0'
                    }`}
                    style={{ width: isActive ? `${stageProgress}%` : undefined }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Streaming Terminal Console */}
      <ReticleFrame
        title="Live Mission Telemetry Stream"
        badge="SPICE / JIT LOG"
        badgeColor="neutral"
        className="font-mono"
        headerRight={
          <div className="flex items-center space-x-2 text-regolith-400 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-regolith-200" />
            <span>STDOUT / BUFFER STREAM</span>
          </div>
        }
      >
        <div className="rounded-lg bg-black p-4 border border-white/10 h-64 overflow-y-auto space-y-1.5 text-xs text-regolith-300 font-mono scrollbar-thin">
          <div className="text-regolith-600 text-[10px] pb-1 border-b border-white/5 flex items-center justify-between">
            <span>--- START OF TELEMETRY STREAM // LICE ORBITAL NODE ---</span>
            <span>IAU 2015 FRAME</span>
          </div>

          {logs.map((log, i) => (
            <div
              key={i}
              className={`leading-relaxed animate-fadeIn ${
                log.includes('complete') || log.includes('verified') || log.includes('converged')
                  ? 'text-white font-semibold'
                  : 'text-regolith-300'
              }`}
            >
              <span className="text-regolith-600 select-none mr-2">&gt;</span>
              {log}
            </div>
          ))}

          <div ref={terminalBottomRef} />
        </div>
      </ReticleFrame>
    </div>
  );
};
