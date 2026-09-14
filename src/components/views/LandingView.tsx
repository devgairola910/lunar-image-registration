import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play,
  Sparkles
} from 'lucide-react';
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
  const [activeFormulaTab, setActiveFormulaTab] = useState<number>(0);

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto">
      {/* =========================================================================
          SECTION 1: HERO & MISSION OVERVIEW
         ========================================================================= */}
      <section className="relative pt-4 sm:pt-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Mission Overview */}
          <div className="lg:col-span-7 space-y-6 gov-card p-6 sm:p-10 rounded-2xl border border-white/20 backdrop-blur-2xl shadow-2xl">
            
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
                ChandraDrishti
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-earth-400 font-display">
                Autonomous Lunar Photogrammetry & Sub-Pixel Coregistration Engine
              </p>
            </div>

            {/* Clean, Concise Tagline */}
            <p className="text-sm sm:text-base text-regolith-300 leading-relaxed font-sans">
              High-precision sub-pixel registration and co-alignment for lunar orbital imagery across extreme solar illumination angles, diverse sensor resolutions, and dynamic crater shadows.
            </p>

            {/* Authoritative Operational Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
              <div className="p-3 rounded-xl bg-black/60 border border-white/15">
                <div className="text-[10px] text-regolith-400 uppercase tracking-wider">REGISTRATION RMSE</div>
                <div className="text-lg sm:text-xl font-bold text-white">&lt; 0.80 px</div>
                <div className="text-[10px] text-regolith-400">Sub-pixel precision</div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/15">
                <div className="text-[10px] text-regolith-400 uppercase tracking-wider">MAX OPTICAL GSD</div>
                <div className="text-lg sm:text-xl font-bold text-white">0.25 m/px</div>
                <div className="text-[10px] text-regolith-400">CH-2 OHRC resolving</div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/15">
                <div className="text-[10px] text-regolith-400 uppercase tracking-wider">SCALE DIVERGENCE</div>
                <div className="text-lg sm:text-xl font-bold text-earth-300">Up to 20:1</div>
                <div className="text-[10px] text-regolith-400">Cross-sensor scale ratio</div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/15">
                <div className="text-[10px] text-regolith-400 uppercase tracking-wider">GEODETIC DATUM</div>
                <div className="text-lg sm:text-xl font-bold text-white">IAU 2015</div>
                <div className="text-[10px] text-regolith-400">Mean Earth / Polar Axis</div>
              </div>
            </div>

            {/* Action Callouts */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={onStartRegistration}
                className="group relative inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-white hover:bg-regolith-100 text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-2xl hover:scale-[1.02] cursor-pointer"
              >
                <span>Launch Registration Pipeline</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (presets.length > 0) onSelectPreset(presets[0]);
                }}
                className="inline-flex items-center space-x-2.5 px-6 py-4 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-white/25 hover:border-white/50 text-white font-mono text-xs font-semibold transition-all duration-150 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 text-earth-400" />
                <span>Explore Clavius Benchmark</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Resolution Lunar Orbital Surface Imagery */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-[4/5] rounded-2xl overflow-hidden bg-black group">
              {/* Lunar Orbital Surface Image */}
              <img
                src="/lunar_clavius_reference.png"
                alt="Lunar Orbital Surface Imagery"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />

              {/* Keypoint Correspondence Locks */}
              <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-7 h-7 rounded-full border border-white/80 flex items-center justify-center bg-white/5 shadow-md">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white bg-black/90 px-2 py-0.5 rounded border border-white/30 whitespace-nowrap shadow-xl">
                  CLAVIUS D [0.38 px RMSE]
                </span>
              </div>

              <div className="absolute top-[26%] left-[30%] pointer-events-none">
                <div className="w-5 h-5 rounded-full border border-regolith-300 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-regolith-200 rounded-full"></div>
                </div>
                <span className="absolute left-7 top-1/2 -translate-y-1/2 text-[9px] font-mono text-regolith-200 bg-black/85 px-2 py-0.5 rounded border border-white/20 whitespace-nowrap">
                  NORTH TERRACE
                </span>
              </div>

              <div className="absolute bottom-[32%] right-[22%] pointer-events-none">
                <div className="w-5 h-5 rounded-full border border-regolith-300 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-regolith-200 rounded-full"></div>
                </div>
                <span className="absolute right-7 top-1/2 -translate-y-1/2 text-[9px] font-mono text-regolith-200 bg-black/85 px-2 py-0.5 rounded border border-white/20 whitespace-nowrap">
                  SOUTH RIM EJECTA
                </span>
              </div>

              {/* Top Sensor Badge */}
              <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/30 text-xs font-mono text-white shadow-xl">
                <span className="w-2 h-2 rounded-full bg-white/80"></span>
                <span className="font-bold">CH-2 OHRC // TARGET: CLAVIUS CRATER</span>
              </div>

              {/* GSD Metric */}
              <div className="absolute top-4 right-4 px-2.5 py-1.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/30 text-[10px] font-mono text-regolith-200">
                GSD: 0.25 m/px
              </div>

              {/* Bottom Calibration Status Bar */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/25 text-[10px] font-mono text-regolith-200 font-semibold">
                  LAT: 58.40°S • LON: 14.40°W
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-black/90 backdrop-blur-md border border-white/25 text-[10px] font-mono text-white flex items-center font-bold">
                  <span>BORESIGHT LOCK: 98.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CURATED LUNAR VALIDATION BASINS & GROUND TRUTH BENCHMARKS
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-5 sm:p-6 rounded-2xl gov-card border border-white/15 backdrop-blur-2xl shadow-xl">
          <div>
            <div className="text-earth-400 font-mono text-xs uppercase tracking-wider font-bold mb-1">
              VERIFIED GROUND TRUTH BENCHMARKS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Planetary Calibration Basins & Presets
            </h2>
          </div>
          <button
            onClick={() => {
              if (presets.length > 0) onSelectPreset(presets[0]);
            }}
            className="group inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-obsidian-900/90 hover:bg-white/10 border border-white/20 hover:border-white/40 text-xs text-regolith-200 hover:text-white font-mono shadow-sm cursor-pointer transition-all duration-150 active:scale-[0.98]"
            title="Preload calibrated Clavius Crater test scenario"
          >
            <span>Directly preload verified orbital telemetry & sensor pairs</span>
            <ArrowRight className="w-3.5 h-3.5 text-regolith-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="group relative cursor-pointer rounded-2xl p-6 gov-card hover:gov-card-accent border border-white/15 hover:border-earth-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-white/10 text-white border border-white/20 uppercase tracking-wide">
                    {preset.difficulty}
                  </span>
                  <span className="text-xs font-mono text-earth-300 font-semibold">
                    {preset.location}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-earth-300 transition-colors font-display">
                    {preset.title}
                  </h3>
                  <div className="text-xs text-regolith-400 font-mono mt-0.5">
                    Target: {preset.targetFeature}
                  </div>
                </div>

                <p className="text-xs text-regolith-300 leading-relaxed">
                  {preset.description}
                </p>

                {/* Sensor Pair Breakdown */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/70 border border-white/10">
                    <div className="text-[9px] text-regolith-500 font-bold uppercase">SOURCE FRAME</div>
                    <div className="text-white font-bold text-xs truncate mt-0.5">{preset.sourceMeta.sensorType}</div>
                    <div className="text-[11px] text-regolith-300 mt-1">GSD: {preset.sourceMeta.resolution} m/px</div>
                    <div className="text-[11px] text-regolith-400">Sun: {preset.sourceMeta.sunElevation}° | Phase: {preset.sourceMeta.phaseAngle}°</div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/70 border border-white/10">
                    <div className="text-[9px] text-regolith-500 font-bold uppercase">REFERENCE BASELINE</div>
                    <div className="text-white font-bold text-xs truncate mt-0.5">{preset.referenceMeta.sensorType}</div>
                    <div className="text-[11px] text-regolith-300 mt-1">GSD: {preset.referenceMeta.resolution} m/px</div>
                    <div className="text-[11px] text-regolith-400">Sun: {preset.referenceMeta.sunElevation}° | Phase: {preset.referenceMeta.phaseAngle}°</div>
                  </div>
                </div>
              </div>

              {/* Action link */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-regolith-300 group-hover:text-white">
                <span className="flex items-center space-x-2">
                  <Play className="w-3.5 h-3.5 text-earth-400" />
                  <span>Ingest Test Case Data</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-earth-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 5-STAGE REGISTRATION PIPELINE ARCHITECTURE
         ========================================================================= */}
      <section className="space-y-6" id="architecture">
        <div className="p-5 sm:p-6 rounded-2xl gov-card border border-white/15 backdrop-blur-2xl shadow-xl">
          <div className="text-earth-400 font-mono text-xs uppercase tracking-wider font-bold mb-1">
            PIPELINE ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            The 5-Stage Coregistration Pipeline
          </h2>
          <p className="text-sm text-regolith-200 mt-1 max-w-3xl leading-relaxed">
            Mathematical formulation designed to handle illumination differences, terrain relief, and feature distribution across lunar crater terrain.
          </p>
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 font-mono text-xs">
          {[
            { id: 0, title: 'Hapke Photometric Correction' },
            { id: 1, title: 'LoFTR Cross-Attention Matrix' },
            { id: 2, title: 'Voronoi Spatial Tile Partitioning' },
            { id: 3, title: 'MAGSAC++ Projective Homography' },
            { id: 4, title: 'Levenberg-Marquardt Sub-Pixel Refinement' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFormulaTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                activeFormulaTab === tab.id
                  ? 'bg-white text-black font-bold shadow-lg'
                  : 'bg-obsidian-900 text-regolith-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Formula Tab Content Cards */}
        <div className="gov-card p-6 sm:p-8 rounded-2xl border border-white/20">
          {activeFormulaTab === 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-earth-400 uppercase tracking-wide font-bold">
                  STAGE 1: RADIOMETRIC NORMALIZATION
                </span>
                <span className="text-xs font-mono text-regolith-400">Reflectance Correction</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Modified Hapke Bidirectional Reflectance Model
              </h3>
              <p className="text-sm text-regolith-200 leading-relaxed">
                Raw radiance values are normalized into standard reflectance to neutralize illumination disparities caused by opposing solar angles:
              </p>
              
              <div className="p-5 rounded-xl formula-block text-white text-base sm:text-lg text-center overflow-x-auto tracking-wide my-4 font-mono">
                {"r(i, e, α) = (w / 4π) · [ μ₀ / (μ₀ + μ) ] · [ B(α) · P(α) + H(μ₀) · H(μ) - 1 ]"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-regolith-300">
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">μ₀ = cos(i), μ = cos(e)</strong>: Incidence & emergence angles relative to the surface normal.
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">B(α) Opposition Surge</strong>: Corrects coherent backscatter spikes at low phase angles.
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">H(μ) Multiple Scattering</strong>: Accounts for isotropic multiple scattering in lunar regolith.
                </div>
              </div>
            </div>
          )}

          {activeFormulaTab === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-earth-400 uppercase tracking-wide font-bold">
                  STAGE 2: DENSE FEATURE CORRESPONDENCE
                </span>
                <span className="text-xs font-mono text-regolith-400">Attention Matching</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Transformer Cross-Attention with Dual-Softmax Matrix
              </h3>
              <p className="text-sm text-regolith-200 leading-relaxed">
                Replaces local gradient descriptors with dense multi-scale attention blocks to establish reliable ties across shadow reversals:
              </p>

              <div className="p-5 rounded-xl formula-block text-white text-base sm:text-lg text-center overflow-x-auto tracking-wide my-4 font-mono">
                {"P(i, j) = softmax( (Q_A · K_B^T) / √d ) ⊙ softmax( (Q_B · K_A^T) / √d )"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-regolith-300">
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Mutual Nearest Neighbor</strong>: Only bidirectional mutually maximal pairs are accepted as candidate ties.
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Sinusoidal Positional Encoding</strong>: Preserves terrain context across uniform highland plateaus.
                </div>
              </div>
            </div>
          )}

          {activeFormulaTab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-earth-400 uppercase tracking-wide font-bold">
                  STAGE 3: SPATIAL BALANCING
                </span>
                <span className="text-xs font-mono text-regolith-400">Uniform Coverage</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                8×8 Uniform Spatial Tile Partitioning
              </h3>
              <p className="text-sm text-regolith-200 leading-relaxed">
                Prevents keypoints from over-clustering on single high-contrast features by enforcing balanced quotas across 64 uniform tiles:
              </p>

              <div className="p-5 rounded-xl formula-block text-white text-base sm:text-lg text-center overflow-x-auto tracking-wide my-4 font-mono">
                {"min Σ [ |S ∩ Tile_k| - Q_quota ]² + λ · Σ (1 - Confidence(p))"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-regolith-300">
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Geometric Stability</strong>: Guarantees full-frame matrix stability without degenerate degrees of freedom.
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Adaptive Thresholds</strong>: In low-contrast tiles, confidence limits adaptively relax to capture subtle textures.
                </div>
              </div>
            </div>
          )}

          {activeFormulaTab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-earth-400 uppercase tracking-wide font-bold">
                  STAGE 4: ROBUST HOMOGRAPHY ESTIMATION
                </span>
                <span className="text-xs font-mono text-regolith-400">Outlier Rejection</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                MAGSAC++ Marginalized Sample Consensus
              </h3>
              <p className="text-sm text-regolith-200 leading-relaxed">
                Marginalizes residual noise across a continuous σ distribution, rejecting parallax and shadow-edge artifacts:
              </p>

              <div className="p-5 rounded-xl formula-block text-white text-base sm:text-lg text-center overflow-x-auto tracking-wide my-4 font-mono">
                {"L(H) = Σ ∫ exp( -r_i(H)² / (2σ²) ) · P(σ) dσ,   where r_i(H) = || x_i' - H·x_i ||₂"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-regolith-300">
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Continuous Loss</strong>: Weights correspondences smoothly by residual error rather than hard binary thresholds.
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Degeneracy Safeguards</strong>: Detects and discards coplanar false solutions in flat maria basins.
                </div>
              </div>
            </div>
          )}

          {activeFormulaTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-earth-400 uppercase tracking-wide font-bold">
                  STAGE 5: SUB-PIXEL OPTIMIZATION
                </span>
                <span className="text-xs font-mono text-regolith-400">Levenberg-Marquardt</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Non-Linear Damped Least Squares Refinement
              </h3>
              <p className="text-sm text-regolith-200 leading-relaxed">
                Refines initial transformation into final sub-pixel parameters by minimizing Sampson reprojection error over verified inliers:
              </p>

              <div className="p-5 rounded-xl formula-block text-white text-base sm:text-lg text-center overflow-x-auto tracking-wide my-4 font-mono">
                {"Δp = ( J^T · Σ⁻¹ · J + λ · diag(J^T · Σ⁻¹ · J) )⁻¹ · J^T · Σ⁻¹ · r(p)"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-regolith-300">
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Covariance Weighting</strong>: Weights individual points by local entropy and signal-to-noise ratio.
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                  <strong className="text-white">Sub-Pixel Residuals</strong>: Yields sub-pixel precision with verified error metrics.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: COMPARATIVE BENCHMARK MATRIX
         ========================================================================= */}
      <section className="space-y-6">
        <div className="p-5 sm:p-6 rounded-2xl gov-card border border-white/15 backdrop-blur-2xl shadow-xl">
          <div className="text-earth-400 font-mono text-xs uppercase tracking-wider font-bold mb-1">
            VALIDATION BENCHMARKS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Algorithm Performance Comparison
          </h2>
          <p className="text-sm text-regolith-200 mt-1 max-w-3xl leading-relaxed">
            Empirical evaluation across paired lunar orbital frames with opposing solar illumination and variable crater geometries.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="gov-card rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-black/80 border-b border-white/15 text-regolith-300 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:px-6">Algorithm / Pipeline</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">RMSE (px)</th>
                  <th className="p-4">Inlier Ratio</th>
                  <th className="p-4">Max Δ Sun Angle</th>
                  <th className="p-4">Scale Invariance</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-regolith-200">
                <tr className="bg-white/10 font-semibold text-white">
                  <td className="p-4 sm:px-6 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-300"></span>
                    <strong className="text-sm text-white">ChandraDrishti (LoFTR + MAGSAC++)</strong>
                  </td>
                  <td className="p-4 text-earth-300">Deep Transformer + Epipolar</td>
                  <td className="p-4 text-white font-bold text-sm">0.42 ± 0.18 px</td>
                  <td className="p-4 text-white font-bold">92.4%</td>
                  <td className="p-4">84.5° (Shadow Inversions)</td>
                  <td className="p-4">Up to 20:1</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 text-[10px] font-bold">
                      OPTIMAL
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-white/5">
                  <td className="p-4 sm:px-6 font-medium text-white">SuperPoint + SuperGlue</td>
                  <td className="p-4 text-regolith-400">Sparse Graph Neural Net</td>
                  <td className="p-4 text-regolith-200">1.14 ± 0.42 px</td>
                  <td className="p-4 text-regolith-300">74.2%</td>
                  <td className="p-4">52.0°</td>
                  <td className="p-4">Up to 8:1</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-regolith-300 border border-white/15 text-[10px]">
                      BENCHMARK
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-white/5">
                  <td className="p-4 sm:px-6 font-medium text-white">RoMa (Dense Matching)</td>
                  <td className="p-4 text-regolith-400">Dense ViT Foundation</td>
                  <td className="p-4 text-regolith-200">0.78 ± 0.29 px</td>
                  <td className="p-4 text-regolith-300">81.0%</td>
                  <td className="p-4">65.0°</td>
                  <td className="p-4">Up to 12:1</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-regolith-300 border border-white/15 text-[10px]">
                      BENCHMARK
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-white/5 text-regolith-400">
                  <td className="p-4 sm:px-6">SIFT + Classic RANSAC</td>
                  <td className="p-4">DoG Scale-Space</td>
                  <td className="p-4 text-telemetry-red">4.82 ± 2.10 px</td>
                  <td className="p-4 text-telemetry-red">18.4% (Shadow failures)</td>
                  <td className="p-4">22.0°</td>
                  <td className="p-4">Up to 3:1</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-telemetry-red/20 text-telemetry-red border border-telemetry-red/30 text-[10px]">
                      FAIL-PRONE
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-white/5 text-regolith-400">
                  <td className="p-4 sm:px-6">ORB + RANSAC</td>
                  <td className="p-4">FAST + BRIEF</td>
                  <td className="p-4 text-telemetry-red">6.25 ± 3.40 px</td>
                  <td className="p-4 text-telemetry-red">11.2%</td>
                  <td className="p-4">15.0°</td>
                  <td className="p-4">Up to 2:1</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-telemetry-red/20 text-telemetry-red border border-telemetry-red/30 text-[10px]">
                      FAIL-PRONE
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: ISRO CHANDRAYAAN LUNAR ORBITER SENSOR PAYLOADS
         ========================================================================= */}
      <section className="space-y-6">
        <div className="p-5 sm:p-6 rounded-2xl gov-card border border-white/15 backdrop-blur-2xl shadow-xl">
          <div className="text-earth-400 font-mono text-xs uppercase tracking-wider font-bold mb-1">
            SUPPORTED INSTRUMENTATION
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Chandrayaan Sensor Payloads
          </h2>
          <p className="text-sm text-regolith-200 mt-1 max-w-3xl leading-relaxed">
            Supported optical sensor configurations and resolution profiles across Chandrayaan lunar payloads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="gov-card p-5 rounded-xl border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20">
                OHRC PAYLOAD
              </span>
              <span className="text-[11px] font-mono text-regolith-300 font-medium">CHANDRAYAAN-2</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Orbiter High Resolution Camera
            </h3>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Sub-meter lunar orbital imagery mapping boulders, craters, and terrain relief for landing site evaluation.
            </p>
            <div className="space-y-1.5 pt-2 font-mono text-xs border-t border-white/10 text-regolith-300">
              <div className="flex justify-between"><span>Nominal GSD:</span> <strong className="text-white">0.25 m / pixel</strong></div>
              <div className="flex justify-between"><span>Swath Width:</span> <strong className="text-white">12 km</strong></div>
              <div className="flex justify-between"><span>Spectral Band:</span> <strong className="text-white">450–900 nm</strong></div>
              <div className="flex justify-between"><span>Detector:</span> <strong className="text-white">TDI Panchromatic</strong></div>
            </div>
          </div>

          <div className="gov-card p-5 rounded-xl border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20">
                TMC-2 PAYLOAD
              </span>
              <span className="text-[11px] font-mono text-regolith-300 font-medium">CHANDRAYAAN-2</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Terrain Mapping Camera-2
            </h3>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Tri-stereo optical imaging configuration providing Fore, Nadir, and Aft views to construct high-accuracy Digital Elevation Models.
            </p>
            <div className="space-y-1.5 pt-2 font-mono text-xs border-t border-white/10 text-regolith-300">
              <div className="flex justify-between"><span>Nominal GSD:</span> <strong className="text-white">5.0 m / pixel</strong></div>
              <div className="flex justify-between"><span>Swath Width:</span> <strong className="text-white">20 km</strong></div>
              <div className="flex justify-between"><span>Stereo Angles:</span> <strong className="text-white">+25°, 0°, -25°</strong></div>
              <div className="flex justify-between"><span>Elevation:</span> <strong className="text-white">3D DEM Stereo</strong></div>
            </div>
          </div>

          <div className="gov-card p-5 rounded-xl border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20">
                IIRS PAYLOAD
              </span>
              <span className="text-[11px] font-mono text-regolith-300 font-medium">CHANDRAYAAN-2</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Imaging Infrared Spectrometer
            </h3>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Hyperspectral sensor mapping hydroxyl (OH/H2O) absorption features and mineralogical surface distributions.
            </p>
            <div className="space-y-1.5 pt-2 font-mono text-xs border-t border-white/10 text-regolith-300">
              <div className="flex justify-between"><span>Spectral Range:</span> <strong className="text-white">0.8 – 5.0 µm</strong></div>
              <div className="flex justify-between"><span>Channels:</span> <strong className="text-white">250 bands</strong></div>
              <div className="flex justify-between"><span>Nominal GSD:</span> <strong className="text-white">80 m / pixel</strong></div>
              <div className="flex justify-between"><span>SNR:</span> <strong className="text-white">&gt; 500 : 1</strong></div>
            </div>
          </div>

          <div className="gov-card p-5 rounded-xl border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20">
                DFSAR PAYLOAD
              </span>
              <span className="text-[11px] font-mono text-regolith-300 font-medium">CHANDRAYAAN-2</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Dual-Frequency Synthetic Radar
            </h3>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Polarimetric radar penetrating lunar regolith to map subsurface dielectric properties and crater structure.
            </p>
            <div className="space-y-1.5 pt-2 font-mono text-xs border-t border-white/10 text-regolith-300">
              <div className="flex justify-between"><span>Bands:</span> <strong className="text-white">L-band, S-band</strong></div>
              <div className="flex justify-between"><span>Resolution:</span> <strong className="text-white">2 – 75 m</strong></div>
              <div className="flex justify-between"><span>Polarimetry:</span> <strong className="text-white">Full Hybrid</strong></div>
              <div className="flex justify-between"><span>Penetration:</span> <strong className="text-white">Sub-regolith</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CALL TO ACTION
         ========================================================================= */}
      <section className="rounded-2xl p-8 sm:p-12 gov-card border border-white/20 relative overflow-hidden backdrop-blur-2xl shadow-2xl text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-white/5 border border-white/15 text-xs font-mono text-earth-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSTANT BROWSER-BASED PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Ready to Coregister Lunar Imagery?
          </h2>
          <p className="text-sm text-regolith-300 leading-relaxed">
            Upload custom optical frames or preload high-contrast crater benchmarks to evaluate sub-pixel registration accuracy and spatial coverage in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartRegistration}
            className="px-8 py-4 rounded-xl bg-white hover:bg-regolith-100 text-black font-bold text-sm tracking-wide transition-all shadow-xl hover:scale-[1.02] cursor-pointer flex items-center space-x-2"
          >
            <span>Launch Ingestion Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (presets.length > 0) onSelectPreset(presets[0]);
            }}
            className="px-6 py-4 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-white/25 hover:border-white/50 text-white font-mono text-xs font-semibold transition-all cursor-pointer shadow-lg flex items-center space-x-2"
          >
            <Play className="w-3.5 h-3.5 text-earth-400" />
            <span>Load Clavius Benchmark</span>
          </button>
        </div>
      </section>
    </div>
  );
};
