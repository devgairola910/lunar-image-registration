import React, { useRef } from 'react';
import { 
  Upload, 
  SunMedium, 
  Layers, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
} from 'lucide-react';
import { ReticleFrame } from '../common/ReticleFrame';
import type { ImageMetadata, SensorType, PresetScenario } from '../../types/registration';
import { SENSORS } from '../../utils/mockDataGenerator';
import { soundFx } from '../../utils/soundEffects';

interface UploadViewProps {
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  onUpdateSourceMeta: (meta: Partial<ImageMetadata>) => void;
  onUpdateRefMeta: (meta: Partial<ImageMetadata>) => void;
  onRunRegistration: () => void;
  onSelectPreset: (preset: PresetScenario) => void;
  presets: PresetScenario[];
  activePresetId?: string;
  onResetToDefault: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  sourceMeta,
  referenceMeta,
  onUpdateSourceMeta,
  onUpdateRefMeta,
  onRunRegistration,
  onSelectPreset,
  presets,
  activePresetId,
  onResetToDefault
}) => {
  const srcInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    target: 'source' | 'reference'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;
      if (target === 'source') {
        onUpdateSourceMeta({
          previewUrl,
          imageName: file.name,
          customFile: file
        });
      } else {
        onUpdateRefMeta({
          previewUrl,
          imageName: file.name,
          customFile: file
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, target: 'source' | 'reference') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    soundFx.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;
      if (target === 'source') {
        onUpdateSourceMeta({
          previewUrl,
          imageName: file.name,
          customFile: file
        });
      } else {
        onUpdateRefMeta({
          previewUrl,
          imageName: file.name,
          customFile: file
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const isReadyToRun = Boolean(sourceMeta.previewUrl && referenceMeta.previewUrl);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Section: Title and Preset Quick-Select */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="text-regolith-400 font-mono text-xs uppercase tracking-wider mb-1">
            SENSOR INGESTION CONSOLE // STAGE 02
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Optical Sensor Frames & Metadata
          </h2>
          <p className="text-xs sm:text-sm text-regolith-400">
            Ingest Chandrayaan-2 moving sensor frames and NASA LRO fixed reference frames.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-regolith-400 mr-1">
            Preload Target:
          </span>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                soundFx.playClick();
                onSelectPreset(p);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                activePresetId === p.id
                  ? 'bg-regolith-800 text-white border-white/30 font-semibold'
                  : 'bg-obsidian-900 text-regolith-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {p.title.split(' ')[0]}
            </button>
          ))}
          <button
            onClick={() => {
              soundFx.playClick();
              onResetToDefault();
            }}
            title="Reset to default settings"
            className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-regolith-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dual Ingestion Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SOURCE IMAGE PANEL */}
        <ReticleFrame
          title="Source Optical Frame (Moving / Chandrayaan-2)"
          badge="ISRO CH-2"
          badgeColor="neutral"
          glow={Boolean(sourceMeta.previewUrl)}
        >
          <div className="space-y-5">
            {/* Upload Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, 'source')}
              onClick={() => srcInputRef.current?.click()}
              className={`relative border border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer text-center group flex flex-col items-center justify-center min-h-[220px] ${
                sourceMeta.previewUrl
                  ? 'border-white/20 bg-obsidian-950/80 hover:border-white/40'
                  : 'border-white/10 bg-obsidian-900/50 hover:border-white/25 hover:bg-obsidian-900/80'
              }`}
            >
              <input
                ref={srcInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'source')}
              />

              {sourceMeta.previewUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 bg-black">
                  <img
                    src={sourceMeta.previewUrl}
                    alt="Source Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end justify-between p-3">
                    <div className="text-left font-mono text-[11px]">
                      <div className="text-white font-bold truncate max-w-[240px]">
                        {sourceMeta.imageName}
                      </div>
                      <div className="text-regolith-400">
                        {sourceMeta.sensorType} • {sourceMeta.resolution} m/px
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-regolith-200 border border-white/15">
                      Replace
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4 font-mono">
                  <div className="w-10 h-10 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center mx-auto text-regolith-200 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-regolith-200">
                    Drop Source Frame or <span className="text-white underline">Browse</span>
                  </div>
                  <p className="text-[11px] text-regolith-500">
                    GeoTIFF, PNG, JPEG, or raw panchromatic raster
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Form */}
            <div className="space-y-4 pt-1 font-mono text-xs">
              {/* Sensor Selection */}
              <div>
                <label className="block text-regolith-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-regolith-300" /> Sensor Payload
                  </span>
                  <span className="text-[10px] text-regolith-500">ISRO Optical</span>
                </label>
                <select
                  value={sourceMeta.sensorType}
                  onChange={(e) => {
                    const sensorKey = e.target.value as SensorType;
                    onUpdateSourceMeta({
                      sensorType: sensorKey,
                      resolution: SENSORS[sensorKey].nominalGsd
                    });
                  }}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="CH2_OHRC">Chandrayaan-2 OHRC (0.25 m/px Panchromatic)</option>
                  <option value="CH2_TMC">Chandrayaan-2 TMC-2 (5.0 m/px Stereo)</option>
                  <option value="CH2_IIRS">Chandrayaan-2 IIRS (80.0 m/px Hyperspectral)</option>
                  <option value="OTHER">Custom Sensor / Other Payload</option>
                </select>
                <p className="text-[10px] text-regolith-500 mt-1">
                  {SENSORS[sourceMeta.sensorType].description}
                </p>
              </div>

              {/* Sun Elevation Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-regolith-400">
                  <span className="flex items-center gap-1.5">
                    <SunMedium className="w-3.5 h-3.5 text-regolith-300" /> Sun Elevation Angle
                  </span>
                  <span className="text-white font-bold">{sourceMeta.sunElevation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={sourceMeta.sunElevation}
                  onChange={(e) => onUpdateSourceMeta({ sunElevation: parseFloat(e.target.value) })}
                  className="w-full accent-white bg-obsidian-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-regolith-500">
                  <span>0° Grazing (PSR Shadows)</span>
                  <span>45° Moderate</span>
                  <span>90° Overhead</span>
                </div>
              </div>

              {/* Resolution & Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-regolith-400 mb-1">GSD Resolution (m/px)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={sourceMeta.resolution}
                    onChange={(e) => onUpdateSourceMeta({ resolution: parseFloat(e.target.value) || 0.25 })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-regolith-400 mb-1">Phase Angle (°)</label>
                  <input
                    type="number"
                    step="1"
                    value={sourceMeta.phaseAngle}
                    onChange={(e) => onUpdateSourceMeta({ phaseAngle: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Lunar Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-regolith-400 mb-1">Center Latitude</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sourceMeta.centerCoordinates.lat}
                    onChange={(e) =>
                      onUpdateSourceMeta({
                        centerCoordinates: {
                          ...sourceMeta.centerCoordinates,
                          lat: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-regolith-400 mb-1">Center Longitude</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sourceMeta.centerCoordinates.lon}
                    onChange={(e) =>
                      onUpdateSourceMeta({
                        centerCoordinates: {
                          ...sourceMeta.centerCoordinates,
                          lon: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </ReticleFrame>

        {/* REFERENCE IMAGE PANEL */}
        <ReticleFrame
          title="Reference Baseline Frame (Fixed / NASA LRO)"
          badge="NASA LRO"
          badgeColor="neutral"
          glow={Boolean(referenceMeta.previewUrl)}
        >
          <div className="space-y-5">
            {/* Upload Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, 'reference')}
              onClick={() => refInputRef.current?.click()}
              className={`relative border border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer text-center group flex flex-col items-center justify-center min-h-[220px] ${
                referenceMeta.previewUrl
                  ? 'border-white/20 bg-obsidian-950/80 hover:border-white/40'
                  : 'border-white/10 bg-obsidian-900/50 hover:border-white/25 hover:bg-obsidian-900/80'
              }`}
            >
              <input
                ref={refInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'reference')}
              />

              {referenceMeta.previewUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10 bg-black">
                  <img
                    src={referenceMeta.previewUrl}
                    alt="Reference Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end justify-between p-3">
                    <div className="text-left font-mono text-[11px]">
                      <div className="text-white font-bold truncate max-w-[240px]">
                        {referenceMeta.imageName}
                      </div>
                      <div className="text-regolith-400">
                        {referenceMeta.sensorType} • {referenceMeta.resolution} m/px
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-regolith-200 border border-white/15">
                      Replace
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4 font-mono">
                  <div className="w-10 h-10 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center mx-auto text-regolith-200 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-regolith-200">
                    Drop Reference Frame or <span className="text-white underline">Browse</span>
                  </div>
                  <p className="text-[11px] text-regolith-500">
                    NASA LRO NAC, WAC, Clementine, or LOLA DEM
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Form */}
            <div className="space-y-4 pt-1 font-mono text-xs">
              {/* Sensor Selection */}
              <div>
                <label className="block text-regolith-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-regolith-300" /> Reference Sensor Payload
                  </span>
                  <span className="text-[10px] text-regolith-500">NASA Baseline</span>
                </label>
                <select
                  value={referenceMeta.sensorType}
                  onChange={(e) => {
                    const sensorKey = e.target.value as SensorType;
                    onUpdateRefMeta({
                      sensorType: sensorKey,
                      resolution: SENSORS[sensorKey].nominalGsd
                    });
                  }}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="LRO_NAC">NASA LRO NAC (0.50 m/px Panchromatic)</option>
                  <option value="LRO_WAC">NASA LRO WAC (100.0 m/px Multispectral)</option>
                  <option value="CLEMENTINE">NASA Clementine UVVIS/NIR (115 m/px)</option>
                  <option value="OTHER">Custom Global Reference Basemap</option>
                </select>
                <p className="text-[10px] text-regolith-500 mt-1">
                  {SENSORS[referenceMeta.sensorType].description}
                </p>
              </div>

              {/* Sun Elevation Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-regolith-400">
                  <span className="flex items-center gap-1.5">
                    <SunMedium className="w-3.5 h-3.5 text-regolith-300" /> Sun Elevation Angle
                  </span>
                  <span className="text-white font-bold">{referenceMeta.sunElevation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={referenceMeta.sunElevation}
                  onChange={(e) => onUpdateRefMeta({ sunElevation: parseFloat(e.target.value) })}
                  className="w-full accent-white bg-obsidian-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-regolith-500">
                  <span>0° Grazing (PSR Shadows)</span>
                  <span>45° Moderate</span>
                  <span>90° Overhead</span>
                </div>
              </div>

              {/* Resolution & Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-regolith-400 mb-1">GSD Resolution (m/px)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={referenceMeta.resolution}
                    onChange={(e) => onUpdateRefMeta({ resolution: parseFloat(e.target.value) || 0.5 })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-regolith-400 mb-1">Phase Angle (°)</label>
                  <input
                    type="number"
                    step="1"
                    value={referenceMeta.phaseAngle}
                    onChange={(e) => onUpdateRefMeta({ phaseAngle: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Lunar Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-regolith-400 mb-1">Center Latitude</label>
                  <input
                    type="number"
                    step="0.1"
                    value={referenceMeta.centerCoordinates.lat}
                    onChange={(e) =>
                      onUpdateRefMeta({
                        centerCoordinates: {
                          ...referenceMeta.centerCoordinates,
                          lat: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-regolith-400 mb-1">Center Longitude</label>
                  <input
                    type="number"
                    step="0.1"
                    value={referenceMeta.centerCoordinates.lon}
                    onChange={(e) =>
                      onUpdateRefMeta({
                        centerCoordinates: {
                          ...referenceMeta.centerCoordinates,
                          lon: parseFloat(e.target.value) || 0
                        }
                      })
                    }
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </ReticleFrame>
      </div>

      {/* Execution Action Bar */}
      <div className="rounded-xl p-5 mission-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs font-mono">
          {isReadyToRun ? (
            <div className="flex items-center space-x-2 text-telemetry-green">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>SENSOR PAIR READY FOR 5-STAGE REGISTRATION SEQUENCE</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>UPLOAD OR SELECT PRESET IMAGES FOR BOTH SOURCE & REFERENCE</span>
            </div>
          )}
        </div>

        <button
          disabled={!isReadyToRun}
          onClick={() => {
            soundFx.playClick();
            onRunRegistration();
          }}
          className={`px-7 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-2 ${
            isReadyToRun
              ? 'bg-white hover:bg-regolith-200 text-black shadow-lg hover:scale-105 cursor-pointer'
              : 'bg-obsidian-800 text-regolith-600 border border-white/5 cursor-not-allowed'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Execute Registration Sequence</span>
        </button>
      </div>
    </div>
  );
};
