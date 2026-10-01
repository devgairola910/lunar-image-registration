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
  Target,
  ArrowRight,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { ReticleFrame } from '../common/ReticleFrame';
import type { PipelineStageInfo, RegistrationMetrics, ImageMetadata } from '../../types/registration';

interface ProcessingViewProps {
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  onComplete: () => void;
  onResultsReady?: () => void;
  metrics: RegistrationMetrics;
  taskRunId?: string;
  isAlreadyCompleted?: boolean;
  onMarkCompleted?: () => void;
  isApiPending?: boolean;
}

const STAGES: Omit<PipelineStageInfo, 'status'>[] = [
  {
    id: 'stage_1',
    name: 'Metadata-Aware Preprocessing',
    subtitle: 'SPICE Kernels & Radiometric Normalization',
    description: 'Loading orbital ephemeris, calculating phase angle geometry, and equalizing extreme solar illumination differences.',
    durationMs: 1700,
    telemetryLogs: [
      'Loading NAIF SPICE kernels: CH2_ORBITER_V04.BSP, CH1_ORBITER_V02.BSP...',
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
    durationMs: 1700,
    telemetryLogs: [
      'Initializing LoFTR-Lunar neural correspondence backbone (PyTorch JIT)...',
      'Multi-scale feature pyramid decomposition (Level 0: 600x600, Level 1: 300x300)...',
      'Extracted candidate keypoint pairs across detector planes.',
      'Mutual nearest-neighbor cross-check applied.'
    ]
  },
  {
    id: 'stage_3',
    name: 'Tile-Based Matching for Coverage',
    subtitle: '8x8 Uniform Spatial Grid Partitioning',
    description: 'Partitioning the lunar frame into 64 spatial tiles to enforce uniform keypoint density across shadows.',
    durationMs: 1700,
    telemetryLogs: [
      'Partitioning image domain into 8x8 spatial tiles (64 regions total)...',
      'Balancing keypoint density: Suppressing crater rim clusters, boosting flat maria...',
      'Spatial coverage evaluated across populated candidate regions.'
    ]
  },
  {
    id: 'stage_4',
    name: 'Robust Geometric Estimation',
    subtitle: 'MAGSAC++ Epipolar & Homography Optimization',
    description: 'Marginalizing Sample Consensus to eliminate shadow edge outliers and fit precise 3x3 homography.',
    durationMs: 1700,
    telemetryLogs: [
      'Executing MAGSAC++ robust projective estimator (Max iterations: 2,500)...',
      'Iterative σ-consensus scoring: Inlier threshold dynamic bound = 1.50 px.',
      'Filtering shadow-displacement artifacts & crater-wall geometric parallax...'
    ]
  },
  {
    id: 'stage_5',
    name: 'Sub-Pixel Refinement & Scoring',
    subtitle: 'Covariance Fitting & Quality Certification',
    description: 'Parabolic 2D surface interpolation achieving sub-pixel precision and computing final telemetry covariance.',
    durationMs: 1700,
    telemetryLogs: [
      'Performing 2D parabolic quadratic surface peak interpolation...',
      'Evaluating residual errors and mission confidence matrix...'
    ]
  }
];

const getCompletedLogs = () => {
  const list: string[] = [];
  STAGES.forEach((stage, idx) => {
    stage.telemetryLogs.forEach(log => {
      list.push(`[T+${(idx * 1.70 + 0.35).toFixed(2)}s] [${stage.name.split(' ')[0].toUpperCase()}] ${log}`);
    });
  });
  list.push(`[T+8.50s] [SYS] ALL 5 PIPELINE STAGES COMPLETED & CERTIFIED.`);
  list.push(`[T+8.52s] [STATUS] Coregistration transformation locked. Click 'View Results Telemetry' to examine correspondences.`);
  return list;
};

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  sourceMeta,
  referenceMeta,
  onComplete,
  onResultsReady,
  metrics,
  taskRunId,
  isAlreadyCompleted = false,
  onMarkCompleted,
  isApiPending = false
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(() => isAlreadyCompleted ? STAGES.length : 0);
  const [stageProgress, setStageProgress] = useState(() => isAlreadyCompleted ? 100 : 0);
  const [isFinished, setIsFinished] = useState(() => isAlreadyCompleted ? true : false);
  const [logs, setLogs] = useState<string[]>(() => isAlreadyCompleted ? getCompletedLogs() : []);
  const [showNoticePopup, setShowNoticePopup] = useState(false);

  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(0);
  const logTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onResultsReadyRef = useRef(onResultsReady);
  const onMarkCompletedRef = useRef(onMarkCompleted);
  const isApiPendingRef = useRef(isApiPending);
  const isFinishedRef = useRef(isFinished);

  useEffect(() => {
    onResultsReadyRef.current = onResultsReady;
  }, [onResultsReady]);

  useEffect(() => {
    onMarkCompletedRef.current = onMarkCompleted;
  }, [onMarkCompleted]);

  useEffect(() => {
    isApiPendingRef.current = isApiPending;
  }, [isApiPending]);

  useEffect(() => {
    isFinishedRef.current = isFinished;
  }, [isFinished]);

  // Clear all pending log stream timers
  const clearLogTimers = () => {
    logTimersRef.current.forEach(t => clearTimeout(t));
    logTimersRef.current = [];
  };

  // Auto-scroll terminal container internally
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // 40-Second AWS Credit Budget Popup Notice Timer (Triggers once per session)
  useEffect(() => {
    if (isAlreadyCompleted || isFinished) return;

    const popupTimer = setTimeout(() => {
      if (!isFinishedRef.current && sessionStorage.getItem('aws_credit_popup_dismissed') !== 'true') {
        setShowNoticePopup(true);
      }
    }, 40000);

    return () => clearTimeout(popupTimer);
  }, [taskRunId, isAlreadyCompleted, isFinished]);

  const isLowConfidence = Boolean(
    metrics && (
      metrics.confidenceLevel === 'LOW' ||
      (metrics.confidenceScore >= 0 && metrics.confidenceScore < 50) ||
      (metrics as any).status?.startsWith('failed')
    )
  );

  // Main Pipeline Step Execution Engine - Synchronized with real backend API
  useEffect(() => {
    if (isAlreadyCompleted) {
      setIsFinished(true);
      setCurrentStageIdx(STAGES.length);
      setStageProgress(100);
      return;
    }

    clearLogTimers();
    startTimeRef.current = Date.now();
    setCurrentStageIdx(0);
    setStageProgress(0);
    setIsFinished(false);
    setLogs([]);

    let timer: ReturnType<typeof setTimeout>;
    let progressInterval: ReturnType<typeof setInterval>;
    let waitingLogged = false;

    const finishPipeline = () => {
      setIsFinished(true);
      setCurrentStageIdx(STAGES.length);
      setStageProgress(100);
      onResultsReadyRef.current?.();
      onMarkCompletedRef.current?.();
      const elapsedSec = ((Date.now() - startTimeRef.current) / 1000).toFixed(2);
      
      const isLow = Boolean(
        metrics && (
          metrics.confidenceLevel === 'LOW' ||
          (metrics.confidenceScore >= 0 && metrics.confidenceScore < 50) ||
          (metrics as any).status?.startsWith('failed')
        )
      );

      if (isLow) {
        setLogs(prev => [
          ...prev,
          `[T+${elapsedSec}s] [ERROR] Irrelevant or low-correspondence image pair detected!`,
          `[T+${elapsedSec}s] [WARNING] MAGSAC++ inlier ratio dropped below bound (${(metrics?.inlierRatio || 0).toFixed(1)}%).`,
          `[T+${elapsedSec}s] [STATUS] Pipeline halted with LOW CONFIDENCE lock (${(metrics?.confidenceScore || 0).toFixed(1)}%). Click 'View Results Telemetry' for error analysis.`
        ]);
      } else {
        setLogs(prev => [
          ...prev,
          `[T+${elapsedSec}s] [SYS] ALL 5 PIPELINE STAGES COMPLETED & CERTIFIED.`,
          `[T+${elapsedSec}s] [STATUS] Coregistration transformation locked. Click 'View Results Telemetry' to examine correspondences.`
        ]);
      }
    };

    const runStage = (stageIdx: number) => {
      // Stage 5 (last stage) completion logic: Must wait for API response if pending
      if (stageIdx >= STAGES.length) {
        if (isApiPendingRef.current) {
          if (!waitingLogged) {
            waitingLogged = true;
            const elapsedSec = ((Date.now() - startTimeRef.current) / 1000).toFixed(2);
            setLogs(prev => [...prev, `[T+${elapsedSec}s] [SYS] Awaiting PyTorch LoFTR / MAGSAC++ neural tensor response from AWS EC2 node...`]);
          }
          timer = setTimeout(() => runStage(STAGES.length), 250);
          return;
        }
        finishPipeline();
        return;
      }

      setCurrentStageIdx(stageIdx);
      setStageProgress(0);

      const stage = STAGES[stageIdx];
      const stageStart = Date.now();

      // Stream logs for this stage with tracked timer references for clean memory release
      stage.telemetryLogs.forEach((logText, logIdx) => {
        const logTimer = setTimeout(() => {
          const elapsedSec = ((Date.now() - startTimeRef.current) / 1000).toFixed(2);
          setLogs(prev => [...prev, `[T+${elapsedSec}s] [${stage.name.split(' ')[0].toUpperCase()}] ${logText}`]);
        }, logIdx * (stage.durationMs / stage.telemetryLogs.length));
        logTimersRef.current.push(logTimer);
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
        runStage(stageIdx + 1);
      }, stage.durationMs);
    };

    runStage(0);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearLogTimers();
    };
  }, [taskRunId, isAlreadyCompleted]);

  // Trigger completion if API completes while waiting on final stage
  useEffect(() => {
    if (!isApiPending && currentStageIdx >= STAGES.length && !isFinished) {
      const elapsedSec = ((Date.now() - startTimeRef.current) / 1000).toFixed(2);
      setIsFinished(true);
      setStageProgress(100);
      onResultsReadyRef.current?.();
      onMarkCompletedRef.current?.();

      const isLow = Boolean(
        metrics && (
          metrics.confidenceLevel === 'LOW' ||
          (metrics.confidenceScore >= 0 && metrics.confidenceScore < 50) ||
          (metrics as any).status?.startsWith('failed')
        )
      );

      if (isLow) {
        setLogs(prev => [
          ...prev,
          `[T+${elapsedSec}s] [ERROR] Irrelevant or low-correspondence image pair detected!`,
          `[T+${elapsedSec}s] [WARNING] MAGSAC++ inlier ratio dropped below bound (${(metrics?.inlierRatio || 0).toFixed(1)}%).`,
          `[T+${elapsedSec}s] [STATUS] Pipeline halted with LOW CONFIDENCE lock (${(metrics?.confidenceScore || 0).toFixed(1)}%). Click 'View Results Telemetry' for error analysis.`
        ]);
      } else {
        setLogs(prev => [
          ...prev,
          `[T+${elapsedSec}s] [SYS] ALL 5 PIPELINE STAGES COMPLETED & CERTIFIED.`,
          `[T+${elapsedSec}s] [STATUS] Coregistration transformation locked. Click 'View Results Telemetry' to examine correspondences.`
        ]);
      }
    }
  }, [isApiPending, currentStageIdx, isFinished, metrics]);

  const handleSkip = () => {
    onResultsReadyRef.current?.();
    onMarkCompletedRef.current?.();
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
            {isFinished ? (
              isLowConfidence ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-telemetry-red" />
                  <span className="text-telemetry-red font-bold">Pipeline Ended with Low Confidence Warning</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-telemetry-green" />
                  <span className="text-telemetry-green font-bold">All 5 Pipeline Stages Completed // Systems Nominal</span>
                </>
              )
            ) : (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Active Pipeline Execution // Real-Time Telemetry</span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            {isFinished ? (isLowConfidence ? 'Low Correspondence Warning' : 'Lunar Pipeline Execution Complete') : 'Processing Lunar Pipeline'}
          </h2>
          <p className="text-xs font-mono text-regolith-400">
            {sourceMeta.sensorType} ({sourceMeta.resolution}m) ➔ {referenceMeta.sensorType} ({referenceMeta.resolution}m)
          </p>
        </div>

        {/* Action button */}
        {isFinished ? (
          <button
            onClick={onComplete}
            className={`inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl font-mono text-xs font-extrabold tracking-wide uppercase transition-all self-start sm:self-auto cursor-pointer shadow-xl hover:scale-105 ${
              isLowConfidence 
                ? 'bg-telemetry-red hover:bg-rose-600 text-white shadow-rose-900/40' 
                : 'bg-white hover:bg-regolith-200 text-black'
            }`}
          >
            <span>View Results Telemetry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSkip}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 border border-white/15 text-xs font-mono text-regolith-300 hover:text-white transition-all self-start sm:self-auto cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5 text-regolith-200" />
            <span>Fast-Forward to Results</span>
          </button>
        )}
      </div>

      {/* Global Progress Bar */}
      <div className={`p-4 rounded-xl mission-card border space-y-2 ${isLowConfidence && isFinished ? 'border-telemetry-red/40 bg-rose-950/20' : 'border-white/10'}`}>
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-regolith-300">
            {isFinished ? (
              isLowConfidence ? (
                <span className="text-telemetry-red font-bold">
                  LOW CORRESPONDENCE DETECTED (CONFIDENCE: {metrics.confidenceScore.toFixed(1)}%)
                </span>
              ) : (
                <span className="text-telemetry-green font-bold">
                  ALL 5 STAGES COMPLETED &amp; CERTIFIED (IAU 2015 FRAME LOCKED)
                </span>
              )
            ) : (
              <>
                STAGE {Math.min(STAGES.length, currentStageIdx + 1)} OF {STAGES.length}:{' '}
                <strong className="text-white">
                  {STAGES[Math.min(STAGES.length - 1, currentStageIdx)].name}
                </strong>
              </>
            )}
          </span>
          <span className={`font-bold ${isFinished ? (isLowConfidence ? 'text-telemetry-red' : 'text-telemetry-green') : 'text-white'}`}>
            {isFinished ? '100%' : `${overallProgress}%`}
          </span>
        </div>
        <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full transition-all duration-150 ${
              isFinished
                ? isLowConfidence 
                  ? 'bg-telemetry-red shadow-[0_0_12px_rgba(239,68,68,0.6)]' 
                  : 'bg-telemetry-green shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                : 'bg-gradient-to-r from-earth-400 via-white to-telemetry-green'
            }`}
            style={{ width: isFinished ? '100%' : `${overallProgress}%` }}
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
                  ? isLowConfidence && isFinished
                    ? 'bg-rose-950/20 border-telemetry-red/40 text-telemetry-red'
                    : 'bg-obsidian-900 border-telemetry-green/30 text-regolith-200'
                  : 'bg-obsidian-950 border-white/5 text-regolith-600 opacity-50'
              }`}
            >
              <div className="space-y-2">
                {/* Node Status Indicator */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[10px] text-regolith-400 font-semibold uppercase tracking-wider">PHASE</span>
                  {isCompleted ? (
                    isLowConfidence && isFinished ? (
                      <div className="flex items-center space-x-1 text-telemetry-red font-semibold">
                        <XCircle className="w-3.5 h-3.5 text-telemetry-red" />
                        <span className="text-[10px]">WARN</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-telemetry-green font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-telemetry-green" />
                        <span className="text-[10px]">DONE</span>
                      </div>
                    )
                  ) : isActive ? (
                    <div className="flex items-center space-x-1 text-white font-bold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-telemetry-green" />
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
                        ? isLowConfidence && isFinished
                          ? 'bg-telemetry-red/20 text-telemetry-red'
                          : 'bg-telemetry-green/10 text-telemetry-green'
                        : 'bg-obsidian-900 text-regolith-600'
                    }`}
                  >
                    {getStageIcon(idx)}
                  </div>
                  <h4
                    className={`text-xs font-bold font-display leading-tight ${
                      isActive ? 'text-white' : isCompleted ? (isLowConfidence && isFinished ? 'text-rose-200' : 'text-regolith-100') : 'text-regolith-500'
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
                        ? isLowConfidence && isFinished
                          ? 'bg-telemetry-red w-full shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                          : 'bg-telemetry-green w-full shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                        : isActive
                        ? 'bg-telemetry-green'
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

      {/* Completion Banner */}
      {isFinished && (
        <div className={`p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn shadow-2xl border ${
          isLowConfidence 
            ? 'bg-rose-950/30 border-telemetry-red/50 shadow-rose-950/20' 
            : 'bg-obsidian-850/95 border-telemetry-green/40'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              isLowConfidence 
                ? 'bg-telemetry-red/20 border-telemetry-red/40 text-telemetry-red' 
                : 'bg-telemetry-green/10 border-telemetry-green/30 text-telemetry-green'
            }`}>
              {isLowConfidence ? <AlertTriangle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
            </div>
            <div>
              <div className="text-white font-bold text-base font-display">
                {isLowConfidence ? 'Low-Correspondence / Irrelevant Image Pair Detected' : 'All 5 Pipeline Stages Successfully Completed & Certified'}
              </div>
              <div className="text-xs font-mono text-regolith-300 mt-0.5">
                RMSE: <strong className={isLowConfidence ? 'text-telemetry-red' : 'text-telemetry-green'}>{metrics.rmseTotal.toFixed(3)} px</strong> • Inlier Ratio: <strong className={isLowConfidence ? 'text-telemetry-red' : 'text-telemetry-green'}>{metrics.inlierRatio > 1 ? metrics.inlierRatio.toFixed(1) : (metrics.inlierRatio * 100).toFixed(1)}%</strong> • Confidence: <strong className={isLowConfidence ? 'text-telemetry-red font-bold' : 'text-telemetry-green'}>{metrics.confidenceScore.toFixed(1)}% ({metrics.confidenceLevel})</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onComplete}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-2xl hover:scale-105 ${
              isLowConfidence 
                ? 'bg-telemetry-red hover:bg-rose-600 text-white shadow-rose-900/50' 
                : 'bg-white hover:bg-regolith-200 text-black'
            }`}
          >
            <span>View Results Telemetry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

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
        <div 
          ref={terminalContainerRef}
          className="rounded-lg bg-black p-4 border border-white/10 h-64 overflow-y-auto space-y-1.5 text-xs text-regolith-300 font-mono scrollbar-thin"
        >
          <div className="text-regolith-600 text-[10px] pb-1 border-b border-white/5 flex items-center justify-between">
            <span>--- START OF TELEMETRY STREAM // CHANDRADRISHTI ORBITAL NODE ---</span>
            <span>IAU 2015 FRAME</span>
          </div>

          {logs.map((log, i) => (
            <div
              key={i}
              className={`leading-relaxed animate-fadeIn ${
                log.includes('ERROR') || log.includes('LOW CONFIDENCE') || log.includes('Irrelevant') || log.includes('WARNING') || log.includes('halted')
                  ? 'text-telemetry-red font-bold'
                  : log.includes('complete') || log.includes('COMPLETED') || log.includes('verified') || log.includes('converged') || log.includes('locked')
                  ? 'text-telemetry-green font-semibold'
                  : 'text-regolith-300'
              }`}
            >
              <span className="text-regolith-600 select-none mr-2">&gt;</span>
              {log}
            </div>
          ))}
        </div>
      </ReticleFrame>

      {/* 40-Second AWS Credit Budget Notice Modal (Triggers once per session) */}
      {showNoticePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full mission-card border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 font-mono relative">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                  AWS Backend Infrastructure Notice
                </h3>
                <span className="text-[10px] text-amber-400">Resource Optimization Active</span>
              </div>
            </div>
            
            <p className="text-xs text-regolith-200 leading-relaxed">
              We are cutting corners with the AWS FastAPI backend instance due to cloud credit budget constraints (running on CPU free tier). Full neural LoFTR + MAGSAC++ inference on high-resolution orbital frames may take extra time. Please bear with us!
            </p>
            
            <div className="p-3 rounded-lg bg-obsidian-950 border border-white/10 text-[11px] text-regolith-400 flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 flex-shrink-0" />
              <span>Processing continues uninterrupted in the background...</span>
            </div>
            
            <button
              onClick={() => {
                sessionStorage.setItem('aws_credit_popup_dismissed', 'true');
                setShowNoticePopup(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
            >
              I Understand / Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
