import React from 'react';
import { 
  ArrowRight, 
  Target, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Maximize2, 
  SunMedium, 
  Globe2,
  CheckCircle2,
  Play
} from 'lucide-react';
import { ReticleFrame } from '../common/ReticleFrame';
import { soundFx } from '../../utils/soundEffects';
import type { PresetScenario } from '../../types/registration';

interface LandingViewProps {
  onStartRegistration: () => void;
  onSelectPreset: (preset: PresetScenario) => void;
  presets: PresetScenario[];
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartRegistration,
  onSelectPreset,
  presets
}) => {
  return (
    <div className="space-y-12 pb-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission Description & Action CTA */}
          <div className="lg:col-span-7 space-y-6 mission-card p-6 sm:p-8 rounded-2xl border border-white/15 backdrop-blur-2xl shadow-2xl">
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-regolith-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-telemetry-green animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <span className="font-semibold tracking-wider text-regolith-200">ISRO CHANDRAYAAN MISSION NODE</span>
              <span className="text-regolith-600">•</span>
              <span>SYSTEMS NOMINAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white font-display leading-[1.15]">
              ChandraDrishti <br />
              <span className="text-regolith-300">
                Lunar Vision Engine
              </span>
            </h1>

            <p className="text-base sm:text-lg text-regolith-300 max-w-2xl leading-relaxed">
              Find pixel-accurate correspondences between <span className="text-white font-semibold">Chandrayaan-2</span> optical payloads (OHRC, TMC-2, IIRS) and <span className="text-white font-semibold">ISRO reference imagery</span>—invariant to solar elevation disparity, dynamic shadow displacements, and optical scale divergence.
            </p>

            {/* Precision Technical Telemetry Chips */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-obsidian-950/80 border border-white/15 font-mono text-xs text-regolith-200 shadow-sm backdrop-blur-sm">
                <Target className="w-3.5 h-3.5 text-regolith-100" />
                <span>Accuracy: <strong className="text-white">&lt; 0.80 px RMSE</strong></span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-obsidian-950/80 border border-white/15 font-mono text-xs text-regolith-200 shadow-sm backdrop-blur-sm">
                <Layers className="w-3.5 h-3.5 text-regolith-100" />
                <span>Sensors: <strong className="text-white">OHRC • TMC-2 • IIRS</strong></span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-obsidian-950/80 border border-white/15 font-mono text-xs text-regolith-200 shadow-sm backdrop-blur-sm">
                <Globe2 className="w-3.5 h-3.5 text-earth-400" />
                <span>Agency: <strong className="text-white">ISRO SAC / ISSDC</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onStartRegistration();
                }}
                className="group relative inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-regolith-200 text-black font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg cursor-pointer"
              >
                <span>Launch Registration Workflow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  if (presets.length > 0) onSelectPreset(presets[0]);
                }}
                className="inline-flex items-center space-x-2 px-4 py-3.5 rounded-xl bg-obsidian-900/90 hover:bg-obsidian-800 border border-white/20 text-regolith-200 hover:text-white font-mono text-xs transition-all duration-150 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 text-regolith-400" />
                <span>Demo: Clavius Crater</span>
              </button>
            </div>
          </div>

          {/* Right Column: Authentic High-Resolution Lunar Orbital Surface Imagery with Mission Control HUD */}
          <div className="lg:col-span-5 flex justify-center items-center py-2 sm:py-4">
            <div className="relative w-full max-w-[340px] sm:max-w-md aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl group">
              {/* Authentic High-Resolution Lunar Orbital Surface Image */}
              <img
                src="/lunar_clavius_reference.png"
                alt="ISRO Chandrayaan-2 Real Lunar Orbital Panchromatic Surface Imagery"
                className="w-full h-full object-cover object-center filter contrast-115 brightness-95 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />

              {/* Mission Control CRT / Detector Pushbroom Scanlines Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 pointer-events-none"></div>
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)'
                }}
              ></div>

              {/* Animated Optical Radar Sweep Beam */}
              <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-white/12 to-transparent pointer-events-none animate-scan-beam"></div>

              {/* Pulsating Keypoint Correspondence Locks on real crater terrain */}
              <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-9 h-9 rounded-full border border-telemetry-green/70 flex items-center justify-center animate-ping opacity-50"></div>
                <div className="absolute inset-0 w-9 h-9 rounded-full border border-white/70 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-telemetry-green rounded-full shadow-[0_0_8px_#22c55e]"></div>
                </div>
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[9px] font-mono text-white bg-black/90 px-2 py-0.5 rounded border border-white/20 whitespace-nowrap shadow-md">
                  KP #01: TYCHO PEAK [0.38px]
                </span>
              </div>

              <div className="absolute top-[24%] left-[33%] pointer-events-none">
                <div className="w-4 h-4 rounded-full border border-white/50 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[8px] font-mono text-regolith-300 bg-black/80 px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                  KP #02: NORTH RIM
                </span>
              </div>

              <div className="absolute bottom-[36%] right-[22%] pointer-events-none">
                <div className="w-4 h-4 rounded-full border border-white/50 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[8px] font-mono text-regolith-300 bg-black/80 px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                  KP #03: EJECTA RIDGE
                </span>
              </div>

              {/* Precision Targeting Reticle HUD with Corner Brackets */}
              <div className="absolute inset-3 border border-white/15 pointer-events-none">
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-white/80"></div>
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-white/80"></div>
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-white/80"></div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-white/80"></div>

                {/* Sub-grid coordinate fiducials */}
                <div className="absolute top-1/2 left-0 w-2.5 border-t border-white/40"></div>
                <div className="absolute top-1/2 right-0 w-2.5 border-t border-white/40"></div>
                <div className="absolute top-0 left-1/2 h-2.5 border-l border-white/40"></div>
                <div className="absolute bottom-0 left-1/2 h-2.5 border-l border-white/40"></div>

                {/* Central Optical Boresight Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Top Sensor Ingestion Telemetry Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-telemetry-green animate-pulse"></span>
                <span>CH-2 OHRC // TARGET: TYCHO COMPLEX</span>
              </div>

              {/* Resolution & GSD Metric */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/85 backdrop-blur-md border border-white/20 text-[9px] font-mono text-regolith-300">
                GSD: 0.25 m/px
              </div>

              {/* Bottom Mission Calibration Status Bar */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                <div className="px-2 py-1 rounded bg-black/85 backdrop-blur-md border border-white/20 text-[9px] font-mono text-regolith-300">
                  LAT: 43.31°S • LON: 11.36°W
                </div>
                <div className="px-2 py-1 rounded bg-black/85 backdrop-blur-md border border-telemetry-green/40 text-[9px] font-mono text-telemetry-green flex items-center space-x-1.5 shadow-[0_0_10px_rgba(34,197,94,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-telemetry-green"></span>
                  <span>OPTICAL LOCK 94.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Planetary Test Scenarios */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="text-regolith-400 font-mono text-xs uppercase tracking-wider">
              PLANETARY VALIDATION TARGETS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Select a Lunar Test Scenario
            </h2>
          </div>
          <p className="text-xs text-regolith-400 font-mono">
            Click to preload calibrated sensor data & coordinates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {presets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                soundFx.playClick();
                onSelectPreset(preset);
              }}
              className="group relative cursor-pointer rounded-xl p-5 mission-card hover:mission-card-glow border border-white/10 hover:border-white/30 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-regolith-200 border border-white/10 uppercase">
                    {preset.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-regolith-400">
                    {preset.location}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-regolith-100 transition-colors font-display">
                  {preset.title}
                </h3>

                <p className="text-xs text-regolith-400 leading-relaxed">
                  {preset.description}
                </p>

                {/* Sensor Pair Info */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-obsidian-900 border border-white/5">
                    <div className="text-[9px] text-regolith-500">SOURCE SENSOR</div>
                    <div className="text-regolith-200 font-semibold truncate">{preset.sourceMeta.sensorType}</div>
                    <div className="text-[10px] text-regolith-400">{preset.sourceMeta.resolution} m/px • {preset.sourceMeta.sunElevation}° Sun</div>
                  </div>
                  <div className="p-2 rounded bg-obsidian-900 border border-white/5">
                    <div className="text-[9px] text-regolith-500">REFERENCE SENSOR</div>
                    <div className="text-regolith-200 font-semibold truncate">{preset.referenceMeta.sensorType}</div>
                    <div className="text-[10px] text-regolith-400">{preset.referenceMeta.resolution} m/px • {preset.referenceMeta.sunElevation}° Sun</div>
                  </div>
                </div>
              </div>

              {/* Action link */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-regolith-400 group-hover:text-white">
                <span>Load Ingestion Parameters</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Stage Scientific Pipeline Architecture */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-regolith-400 font-mono text-xs uppercase tracking-wider">
            ROBUST MULTI-MODAL PIPELINE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            How The Correspondence Engine Works
          </h2>
          <p className="text-sm text-regolith-400">
            Engineered to overcome extreme lunar illumination disparity, dynamic shadow displacements, and optical scale divergence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {[
            {
              step: '01',
              title: 'Radiometric Preprocessing',
              desc: 'Phase-angle normalization and shadow-mask estimation to equalize extreme sun angle contrast.',
              icon: SunMedium,
            },
            {
              step: '02',
              title: 'LoFTR / SuperPoint Hybrid',
              desc: 'Modality-adaptive transformer feature matching providing dense correspondences in low-texture regolith.',
              icon: Cpu,
            },
            {
              step: '03',
              title: 'Tile-Based Partitioning',
              desc: '8×8 spatial grid balancing to enforce uniform keypoint distribution across the entire lunar frame.',
              icon: Maximize2,
            },
            {
              step: '04',
              title: 'MAGSAC++ Estimation',
              desc: 'Marginalizing sample consensus for robust projective homography and epipolar outlier rejection.',
              icon: ShieldCheck,
            },
            {
              step: '05',
              title: 'Sub-Pixel Refinement',
              desc: 'Parabolic covariance fitting achieving &lt;0.8 px precision with per-point confidence scoring.',
              icon: Target,
            }
          ].map((stage) => {
            const Icon = stage.icon;
            return (
              <ReticleFrame key={stage.step} className="flex flex-col justify-between">
                <div className="space-y-2 font-mono">
                  <div className="flex items-center justify-between text-xs text-regolith-500">
                    <span className="font-bold">STAGE {stage.step}</span>
                    <Icon className="w-4 h-4 text-regolith-300" />
                  </div>
                  <h4 className="text-xs font-bold text-white font-display">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] text-regolith-400 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </ReticleFrame>
            );
          })}
        </div>
      </section>

      {/* Geodetic Precision Highlights */}
      <section className="rounded-2xl p-6 sm:p-8 mission-card border border-white/15 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xl font-bold text-white font-display">
              High-Precision Planetary Georeferencing
            </h3>
            <p className="text-sm text-regolith-300 leading-relaxed">
              Standard optical feature matchers (SIFT, ORB) fail on lunar terrain when solar incidence changes because crater rim shadows flip 180 degrees. The ChandraDrishti engine integrates geometric priors from SPICE ephemeris kernels and deep semi-dense matching to maintain geometric fidelity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs text-regolith-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-telemetry-green flex-shrink-0" />
                <span>Handles 0° to 85° sun elevation delta</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-telemetry-green flex-shrink-0" />
                <span>Cross-resolution scale ratio up to 20:1</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-telemetry-green flex-shrink-0" />
                <span>Export GeoTIFF + Orthorectification TFW</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-telemetry-green flex-shrink-0" />
                <span>IAU 2015 Lunar Mean Earth reference frame</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <button
              onClick={() => {
                soundFx.playClick();
                onStartRegistration();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-regolith-200 text-black font-semibold text-xs tracking-wider uppercase font-mono transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-lg"
            >
              <span>Ingest Sensor Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
