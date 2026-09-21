import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  BarChart3, 
  MapPin, 
  Building, 
  ArrowRight, 
  Play, 
  Award, 
  CheckCircle2
} from 'lucide-react';
import { ReticleFrame } from '../common/ReticleFrame';

interface AboutViewProps {
  onStartRegistration: () => void;
  onNavigateHome: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onStartRegistration,
  onNavigateHome
}) => {
  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto font-sans">
      {/* =========================================================================
          HERO & AGENCY BRIEFING
         ========================================================================= */}
      <section className="relative pt-2 sm:pt-6">
        <div className="gov-card p-4 sm:p-8 lg:p-10 rounded-2xl border border-white/20 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="relative flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white/95 border-2 border-white/30 p-1.5 shadow-xl overflow-hidden flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="ChandraDrishti Logo" 
                  className="w-full h-full object-contain select-none"
                />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-mono font-bold text-earth-400 uppercase tracking-widest block leading-tight">
                  DEPARTMENT OF SPACE • GOVERNMENT OF INDIA
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight mt-0.5">
                  About ChandraDrishti
                </h1>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-[10px] sm:text-xs font-mono text-regolith-200 self-start lg:self-center">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-earth-300 flex-shrink-0" />
              <span>ISRO SAC // PDS4 & IAU-2015 COMPLIANT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-regolith-200 leading-relaxed font-sans">
              <p className="text-sm sm:text-base text-white font-medium">
                <strong>ChandraDrishti</strong> is an autonomous multi-sensor lunar photogrammetry and image coregistration engine developed at the <strong>Space Applications Centre (SAC), ISRO</strong>.
              </p>
              <p>
                Engineered specifically for planetary remote sensing, ChandraDrishti addresses the fundamental challenges of aligning orbital images captured across extreme solar illumination angles, varying spatial resolutions, and complex crater geometries.
              </p>
              <p>
                By combining Hapke photometric normalization, transformer-based cross-attention dense feature matching, Voronoi spatial tile partitioning, MAGSAC++ projective homography, and Levenberg-Marquardt non-linear sub-pixel refinement, the platform achieves validated sub-pixel coregistration accuracy (&lt; 0.80 px RMSE).
              </p>
            </div>

            <div className="lg:col-span-4 gov-card p-4 sm:p-5 rounded-xl border border-white/15 space-y-3 font-mono text-xs flex flex-col justify-center">
              <div className="text-earth-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                INSTITUTIONAL DESK
              </div>
              <div className="space-y-2 text-regolith-300">
                <div className="flex items-start space-x-2">
                  <Building className="w-4 h-4 text-earth-400 flex-shrink-0 mt-0.5" />
                  <span>Space Applications Centre (SAC), ISRO</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-regolith-400 flex-shrink-0 mt-0.5" />
                  <span>Ahmedabad, Gujarat – 380015, India</span>
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-white/10 text-[11px] text-white">
                  <Award className="w-3.5 h-3.5 text-earth-300 flex-shrink-0" />
                  <span>Planetary Remote Sensing Division</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 border-t border-white/10">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-regolith-100 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Launch Registration Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-white/20 text-white font-mono text-xs font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-earth-400" />
              <span>Return to Mission Briefing</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY SCIENTIFIC OBJECTIVES
         ========================================================================= */}
      <section className="space-y-6">
        <div className="p-5 sm:p-6 rounded-2xl gov-card border border-white/15 backdrop-blur-2xl shadow-xl">
          <span className="text-xs font-mono font-bold text-earth-400 uppercase tracking-widest block mb-1">
            CORE OBJECTIVES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Mission & Scientific Objectives
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="gov-card p-6 rounded-2xl border border-white/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-earth-300">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Multi-Sensor Alignment</h3>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Align high-resolution narrow-angle panchromatic frames (OHRC) with wide-swath terrain mapping frames (TMC-2) and hyperspectral datasets (IIRS) across scale ratios up to 20:1.
            </p>
          </div>

          <div className="gov-card p-6 rounded-2xl border border-white/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-earth-300">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Robust Illumination Invariance</h3>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Maintain high matching fidelity across steep solar elevation differentials (&gt; 80° phase angle change) and shadow reversals near polar Permanently Shadowed Regions (PSRs).
            </p>
          </div>

          <div className="gov-card p-6 rounded-2xl border border-white/15 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-earth-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Sub-Pixel Georeferencing</h3>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Deliver precise tie-points and refined transformation matrices aligned with IAU-2015 lunar coordinate baselines to support lander hazard avoidance and lunar cartography.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TECHNICAL PIPELINE ARCHITECTURE
         ========================================================================= */}
      <section className="space-y-6">
        <ReticleFrame
          title="5-Stage Photogrammetric Coregistration Engine"
          badge="PIPELINE SPECIFICATION"
          badgeColor="blue"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-black/60 border border-white/15 space-y-2">
              <div className="text-earth-400 font-bold text-[10px]">STAGE 1</div>
              <div className="text-white font-bold">Hapke Reflectance</div>
              <div className="text-regolith-400 text-[11px] leading-snug">
                Normalizes illumination disparities and photometric phase function.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/15 space-y-2">
              <div className="text-earth-400 font-bold text-[10px]">STAGE 2</div>
              <div className="text-white font-bold">LoFTR Attention</div>
              <div className="text-regolith-400 text-[11px] leading-snug">
                Extracts dense cross-attention feature correspondence fields.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/15 space-y-2">
              <div className="text-earth-400 font-bold text-[10px]">STAGE 3</div>
              <div className="text-white font-bold">Voronoi Partition</div>
              <div className="text-regolith-400 text-[11px] leading-snug">
                Enforces uniform spatial tile coverage across 8×8 grid partitions.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/15 space-y-2">
              <div className="text-earth-400 font-bold text-[10px]">STAGE 4</div>
              <div className="text-white font-bold">MAGSAC++ Consensus</div>
              <div className="text-regolith-400 text-[11px] leading-snug">
                Filters parallax outliers and rejects false homography solutions.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-white/15 space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="text-earth-400 font-bold text-[10px]">STAGE 5</div>
              <div className="text-white font-bold">Levenberg-Marquardt</div>
              <div className="text-regolith-400 text-[11px] leading-snug">
                Refines non-linear Sampson error to sub-pixel precision.
              </div>
            </div>
          </div>
        </ReticleFrame>
      </section>

      {/* =========================================================================
          SUPPORTED CHANDRAYAAN PAYLOADS
         ========================================================================= */}
      <section className="space-y-6">
        <div className="p-4 sm:p-6 rounded-2xl gov-card border border-white/15 backdrop-blur-2xl shadow-xl">
          <span className="text-xs font-mono font-bold text-earth-400 uppercase tracking-widest block mb-1">
            SUPPORTED INSTRUMENTATION
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display">
            Calibrated Sensor Payload Profiles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="gov-card p-5 sm:p-6 rounded-2xl border border-white/15 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-earth-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">OHRC (Orbiter High Resolution Camera)</h3>
              </div>
              <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 self-start sm:self-auto whitespace-nowrap">0.25 m/px</span>
            </div>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Chandrayaan-2 panchromatic sensor providing sub-meter ground sample distance for crater rim mapping and boulder identification.
            </p>
          </div>

          <div className="gov-card p-5 sm:p-6 rounded-2xl border border-white/15 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-earth-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">TMC-2 (Terrain Mapping Camera-2)</h3>
              </div>
              <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 self-start sm:self-auto whitespace-nowrap">5.0 m/px</span>
            </div>
            <p className="text-xs text-regolith-300 leading-relaxed">
              Tri-stereo optical payload generating regional 3D Digital Elevation Models and regional surface baselines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutView;
