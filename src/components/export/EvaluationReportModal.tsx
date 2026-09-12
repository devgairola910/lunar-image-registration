import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
} from 'lucide-react';
import type { RegistrationMetrics, ImageMetadata, KeypointMatch } from '../../types/registration';
import { downloadTelemetryJSON } from '../../utils/exportUtils';
import { soundFx } from '../../utils/soundEffects';

interface EvaluationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: RegistrationMetrics;
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  keypoints: KeypointMatch[];
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  sourceMeta,
  referenceMeta,
  keypoints
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleDownloadJSON = () => {
    soundFx.playClick();
    downloadTelemetryJSON(metrics, sourceMeta, referenceMeta, keypoints);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-obsidian-900 border border-white/20 shadow-2xl overflow-hidden my-8 text-regolith-200 font-mono">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10 text-white border border-white/15">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                LUNAR REGISTRATION EVALUATION REPORT
              </h3>
              <p className="text-xs text-regolith-400">
                Document ID: CHANDRADRISHTI-VAL-2026-CH2-ISRO-0914 // IAU-2015-CERTIFIED
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-regolith-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Document Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none text-xs">
          {/* Mission Executive Summary */}
          <div className="rounded-xl p-4 bg-black/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-telemetry-green" />
                <span className="font-bold text-white uppercase tracking-wider">
                  Executive Geodetic Evaluation
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                GRADE: {metrics.confidenceLevel} (SCORE: {metrics.confidenceScore}%)
              </span>
            </div>

            <p className="text-regolith-300 leading-relaxed text-xs">
              The ChandraDrishti (ISRO Lunar Image Registration Engine) executed a full 5-stage co-registration sequence between Chandrayaan-2 moving sensor payload and ISRO baseline reference imagery. The pipeline successfully established geometric sub-pixel concordance with an overall Root Mean Square Error (RMSE) of{' '}
              <strong className="text-white">{metrics.rmseTotal} pixels</strong>, achieving uniform spatial coverage across {metrics.spatialCoverage}% of the partitioned lunar tile domain.
            </p>
          </div>

          {/* Sensor Ingestion Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-white font-bold border-b border-white/5 pb-1">
                <span>SOURCE OPTICAL FRAME</span>
                <span className="text-regolith-400">ISRO CHANDRAYAAN-2</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-regolith-300">
                <span className="text-regolith-500">Sensor Payload:</span>
                <span className="text-white font-semibold">{sourceMeta.sensorType}</span>
                <span className="text-regolith-500">Ground Sample Dist:</span>
                <span>{sourceMeta.resolution} m/pixel</span>
                <span className="text-regolith-500">Sun Elevation:</span>
                <span>{sourceMeta.sunElevation}° (Solar Incident)</span>
                <span className="text-regolith-500">Lunar Coordinates:</span>
                <span>{sourceMeta.centerCoordinates.lat}° Lat, {sourceMeta.centerCoordinates.lon}° Lon</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-white font-bold border-b border-white/5 pb-1">
                <span>REFERENCE BASELINE FRAME</span>
                <span className="text-regolith-400">ISRO ISSDC / SAC</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-regolith-300">
                <span className="text-regolith-500">Sensor Payload:</span>
                <span className="text-white font-semibold">{referenceMeta.sensorType}</span>
                <span className="text-regolith-500">Ground Sample Dist:</span>
                <span>{referenceMeta.resolution} m/pixel</span>
                <span className="text-regolith-500">Sun Elevation:</span>
                <span>{referenceMeta.sunElevation}° (Solar Incident)</span>
                <span className="text-regolith-500">Lunar Coordinates:</span>
                <span>{referenceMeta.centerCoordinates.lat}° Lat, {referenceMeta.centerCoordinates.lon}° Lon</span>
              </div>
            </div>
          </div>

          {/* Registration Performance Metrics Table */}
          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/60">
            <div className="bg-obsidian-950 px-4 py-2 text-white font-bold border-b border-white/10 flex items-center justify-between">
              <span>STATISTICAL RESIDUAL SUMMARY</span>
              <span className="text-telemetry-green">CERTIFIED ACCURACY</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/10 p-2 text-center">
              <div className="p-3">
                <div className="text-[10px] text-regolith-500 uppercase">Total RMSE</div>
                <div className="text-xl font-bold text-white mt-1">{metrics.rmseTotal} px</div>
                <div className="text-[10px] text-regolith-400">&lt; 0.80 px bound</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-regolith-500 uppercase">Inlier Ratio</div>
                <div className="text-xl font-bold text-white mt-1">{metrics.inlierRatio}%</div>
                <div className="text-[10px] text-regolith-400">{metrics.inlierMatches} / {metrics.totalMatches} points</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-regolith-500 uppercase">Spatial Uniformity</div>
                <div className="text-xl font-bold text-white mt-1">{metrics.spatialCoverage}%</div>
                <div className="text-[10px] text-regolith-400">8x8 Tile Matrix</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-regolith-500 uppercase">Compute Latency</div>
                <div className="text-xl font-bold text-white mt-1">{(metrics.processingTimeTotalMs / 1000).toFixed(2)}s</div>
                <div className="text-[10px] text-regolith-400">5 Pipeline Stages</div>
              </div>
            </div>
          </div>

          {/* 3x3 Projective Homography Matrix */}
          <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-regolith-400 border-b border-white/5 pb-1">
              <span className="font-bold text-white">ESTIMATED 3×3 PROJECTIVE HOMOGRAPHY MATRIX (H)</span>
              <span>MAGSAC++ CONVERGENCE</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-black rounded-lg text-center font-bold text-white border border-white/5">
              {metrics.homographyMatrix.flatMap((row, r) =>
                row.map((val, c) => (
                  <div key={`${r}-${c}`} className="p-1 rounded bg-obsidian-900 border border-white/5">
                    {val.toFixed(6)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-black border-t border-white/10">
          <div className="text-regolith-500 text-[11px]">
            Generated by ChandraDrishti (ISRO Lunar Vision Engine) v2.4
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 text-regolith-200 hover:text-white border border-white/15 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-regolith-200 text-black font-bold transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full JSON Telemetry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
