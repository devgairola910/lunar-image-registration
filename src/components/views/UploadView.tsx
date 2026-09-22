import React, { useRef, useState } from 'react';
import { 
  Upload, 
  SunMedium, 
  Layers, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  XCircle
} from 'lucide-react';
import { ReticleFrame } from '../common/ReticleFrame';
import type { ImageMetadata, SensorType, PresetScenario } from '../../types/registration';
import { SENSORS } from '../../utils/mockDataGenerator';
import { 
  validateImageFile, 
  validateMetadataValues, 
  clampNumber, 
  MAX_FILE_SIZE_MB 
} from '../../utils/validation';

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = (file: File, target: 'source' | 'reference') => {
    const valResult = validateImageFile(file);
    if (!valResult.valid) {
      setUploadError(valResult.error || 'Invalid file uploaded.');
      return;
    }
    setUploadError(null);

    const reader = new FileReader();
    reader.onerror = () => {
      setUploadError(`Failed to read file "${file.name}". Please try another image.`);
    };
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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    target: 'source' | 'reference'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file, target);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent, target: 'source' | 'reference') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file, target);
  };

  const sourceValidation = validateMetadataValues(
    sourceMeta.centerCoordinates.lat,
    sourceMeta.centerCoordinates.lon,
    sourceMeta.resolution,
    sourceMeta.sunElevation
  );

  const refValidation = validateMetadataValues(
    referenceMeta.centerCoordinates.lat,
    referenceMeta.centerCoordinates.lon,
    referenceMeta.resolution,
    referenceMeta.sunElevation,
    referenceMeta.phaseAngle
  );

  const isMetadataValid = 
    sourceValidation.lat.valid &&
    sourceValidation.lon.valid &&
    sourceValidation.resolution.valid &&
    refValidation.lat.valid &&
    refValidation.lon.valid &&
    refValidation.resolution.valid &&
    (refValidation.phaseAngle ? refValidation.phaseAngle.valid : true);

  const isReadyToRun = Boolean(sourceMeta.previewUrl && referenceMeta.previewUrl) && isMetadataValid;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Section: Title and Preset Quick-Select */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl mission-card border border-white/15 backdrop-blur-2xl shadow-xl">
        <div>
          <div className="text-regolith-300 font-mono text-xs uppercase tracking-wider mb-1 font-semibold">
            SENSOR INGESTION CONSOLE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Optical Sensor Frames & Metadata
          </h2>
          <p className="text-xs sm:text-sm text-regolith-200">
            Ingest Chandrayaan-2 moving sensor frames and ISRO baseline reference frames.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-regolith-300 mr-1 font-medium">
            Preload Target:
          </span>
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                activePresetId === p.id
                  ? 'bg-regolith-800 text-white border-white/30 font-semibold'
                  : 'bg-obsidian-900 text-regolith-300 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {p.title.split(' ')[0]}
            </button>
          ))}

          <button
            onClick={onResetToDefault}
            title="Reset to default settings"
            className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-regolith-300 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upload Validation Alert Banner */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-mono flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wide">Ingestion Validation Error</span>
              <p className="mt-0.5 text-red-300">{uploadError}</p>
            </div>
          </div>
          <button 
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-white transition-colors cursor-pointer p-0.5"
            title="Dismiss error alert"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Two Upload Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOURCE IMAGE PANEL */}
        <ReticleFrame
          title="Source Target Frame (Dynamic / Chandrayaan-2)"
          badge="ISRO CH-2"
          badgeColor="teal"
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
                accept=".png,.jpg,.jpeg,.webp,.tif,.tiff,image/*"
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
                    Supports PNG, JPG, TIFF, WebP (Max {MAX_FILE_SIZE_MB}MB)
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
                  <span className="text-[10px] text-regolith-500">Optical Subsystem</span>
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
                  <option value="CH2_OHRC">Chandrayaan-2 OHRC (0.25 m/px High-Res)</option>
                  <option value="CH2_TMC">Chandrayaan-2 TMC-2 (5.0 m/px Stereo)</option>
                  <option value="CH2_IIRS">Chandrayaan-2 IIRS (80.0 m/px Hyperspectral)</option>
                  <option value="OTHER">Other ISRO Lunar Payload</option>
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
                  onChange={(e) => onUpdateSourceMeta({ sunElevation: Number(e.target.value) })}
                  className="w-full accent-white bg-obsidian-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-regolith-600">
                  <span>0° (Grazing/Shadowed)</span>
                  <span>45°</span>
                  <span>90° (Noon Overhead)</span>
                </div>
              </div>

              {/* Ground Sample Distance (GSD) / Resolution */}
              <div>
                <label className="block text-regolith-400 mb-1">
                  Ground Sample Distance (m/pixel)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.01"
                  max="500"
                  value={sourceMeta.resolution}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateSourceMeta({ resolution: isNaN(val) ? 0.01 : val });
                  }}
                  onBlur={() => {
                    onUpdateSourceMeta({ resolution: clampNumber(sourceMeta.resolution, 0.01, 500) });
                  }}
                  className={`w-full bg-obsidian-900 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                    sourceValidation.resolution.valid ? 'border-white/10 focus:border-white/30' : 'border-amber-500/60 text-amber-200'
                  }`}
                />
                {!sourceValidation.resolution.valid && (
                  <p className="text-[10px] text-amber-400 mt-1">{sourceValidation.resolution.message}</p>
                )}
              </div>

              {/* Lunar Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-regolith-400 mb-1">Center Lat (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="-90"
                    max="90"
                    value={sourceMeta.centerCoordinates.lat}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateSourceMeta({
                        centerCoordinates: {
                          ...sourceMeta.centerCoordinates,
                          lat: isNaN(val) ? 0 : val
                        }
                      });
                    }}
                    onBlur={() => {
                      onUpdateSourceMeta({
                        centerCoordinates: {
                          ...sourceMeta.centerCoordinates,
                          lat: clampNumber(sourceMeta.centerCoordinates.lat, -90, 90)
                        }
                      });
                    }}
                    className={`w-full bg-obsidian-900 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                      sourceValidation.lat.valid ? 'border-white/10 focus:border-white/30' : 'border-amber-500/60 text-amber-200'
                    }`}
                  />
                  {!sourceValidation.lat.valid && (
                    <p className="text-[10px] text-amber-400 mt-1">{sourceValidation.lat.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-regolith-400 mb-1">Center Lon (°)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="-180"
                    max="180"
                    value={sourceMeta.centerCoordinates.lon}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateSourceMeta({
                        centerCoordinates: {
                          ...sourceMeta.centerCoordinates,
                          lon: isNaN(val) ? 0 : val
                        }
                      });
                    }}
                    onBlur={() => {
                      onUpdateSourceMeta({
                        centerCoordinates: {
                          ...sourceMeta.centerCoordinates,
                          lon: clampNumber(sourceMeta.centerCoordinates.lon, -180, 180)
                        }
                      });
                    }}
                    className={`w-full bg-obsidian-900 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                      sourceValidation.lon.valid ? 'border-white/10 focus:border-white/30' : 'border-amber-500/60 text-amber-200'
                    }`}
                  />
                  {!sourceValidation.lon.valid && (
                    <p className="text-[10px] text-amber-400 mt-1">{sourceValidation.lon.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ReticleFrame>

        {/* REFERENCE IMAGE PANEL */}
        <ReticleFrame
          title="Reference Baseline Frame (ISRO Archive)"
          badge="ISRO BASELINE"
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
                accept=".png,.jpg,.jpeg,.webp,.tif,.tiff,image/*"
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
                    Supports PNG, JPG, TIFF, WebP (Max {MAX_FILE_SIZE_MB}MB)
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
                  <span className="text-[10px] text-regolith-500">ISRO Baseline</span>
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
                  <option value="CH2_TMC">ISRO Chandrayaan-2 TMC-2 (5.0 m/px)</option>
                  <option value="CH2_OHRC">ISRO Chandrayaan-2 OHRC (0.25 m/px)</option>
                  <option value="CH1_TMC">ISRO Chandrayaan-1 TMC Base (5.0 m/px)</option>
                  <option value="ISRO_MOSAIC">ISRO ISSDC Global Lunar Mosaic (25 m/px)</option>
                  <option value="OTHER">Custom / User Ingested Frame</option>
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
                    min="0.01"
                    max="500"
                    value={referenceMeta.resolution}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateRefMeta({ resolution: isNaN(val) ? 0.01 : val });
                    }}
                    onBlur={() => {
                      onUpdateRefMeta({ resolution: clampNumber(referenceMeta.resolution, 0.01, 500) });
                    }}
                    className={`w-full bg-obsidian-900 border rounded-lg px-3 py-1.5 text-white focus:outline-none transition-colors ${
                      refValidation.resolution.valid ? 'border-white/10 focus:border-white/30' : 'border-amber-500/60 text-amber-200'
                    }`}
                  />
                  {!refValidation.resolution.valid && (
                    <p className="text-[10px] text-amber-400 mt-1">{refValidation.resolution.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-regolith-400 mb-1">Phase Angle (°)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="180"
                    value={referenceMeta.phaseAngle}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateRefMeta({ phaseAngle: isNaN(val) ? 0 : val });
                    }}
                    onBlur={() => {
                      onUpdateRefMeta({ phaseAngle: clampNumber(referenceMeta.phaseAngle || 0, 0, 180) });
                    }}
                    className={`w-full bg-obsidian-900 border rounded-lg px-3 py-1.5 text-white focus:outline-none transition-colors ${
                      refValidation.phaseAngle?.valid ? 'border-white/10 focus:border-white/30' : 'border-amber-500/60 text-amber-200'
                    }`}
                  />
                  {refValidation.phaseAngle && !refValidation.phaseAngle.valid && (
                    <p className="text-[10px] text-amber-400 mt-1">{refValidation.phaseAngle.message}</p>
                  )}
                </div>
              </div>

              {/* Lunar Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-regolith-400 mb-1">Center Latitude</label>
                  <input
                    type="number"
                    step="0.1"
                    min="-90"
                    max="90"
                    value={referenceMeta.centerCoordinates.lat}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateRefMeta({
                        centerCoordinates: {
                          ...referenceMeta.centerCoordinates,
                          lat: isNaN(val) ? 0 : val
                        }
                      });
                    }}
                    onBlur={() => {
                      onUpdateRefMeta({
                        centerCoordinates: {
                          ...referenceMeta.centerCoordinates,
                          lat: clampNumber(referenceMeta.centerCoordinates.lat, -90, 90)
                        }
                      });
                    }}
                    className={`w-full bg-obsidian-900 border rounded-lg px-3 py-1.5 text-white focus:outline-none transition-colors ${
                      refValidation.lat.valid ? 'border-white/10 focus:border-white/30' : 'border-amber-500/60 text-amber-200'
                    }`}
                  />
                  {!refValidation.lat.valid && (
                    <p className="text-[10px] text-amber-400 mt-1">{refValidation.lat.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-regolith-400 mb-1">Center Longitude</label>
                  <input
                    type="number"
                    step="0.1"
                    min="-180"
                    max="180"
                    value={referenceMeta.centerCoordinates.lon}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateRefMeta({
                        centerCoordinates: {
                          ...referenceMeta.centerCoordinates,
                          lon: isNaN(val) ? 0 : val
                        }
                      });
                    }}
                    onBlur={() => {
                      onUpdateRefMeta({
                        centerCoordinates: {
                          ...referenceMeta.centerCoordinates,
                          lon: clampNumber(referenceMeta.centerCoordinates.lon, -180, 180)
                        }
                      });
                    }}
                    className={`w-full bg-obsidian-900 border rounded-lg px-3 py-1.5 text-white focus:outline-none transition-colors ${
                      refValidation.lon.valid ? 'border-white/10 focus:border-white/30' : 'border-amber-500/60 text-amber-200'
                    }`}
                  />
                  {!refValidation.lon.valid && (
                    <p className="text-[10px] text-amber-400 mt-1">{refValidation.lon.message}</p>
                  )}
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
            <div className="flex items-center space-x-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-regolith-300" />
              <span>SENSOR PAIR READY FOR 5-STAGE REGISTRATION SEQUENCE</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                {!sourceMeta.previewUrl || !referenceMeta.previewUrl
                  ? 'UPLOAD OR SELECT PRESET IMAGES FOR BOTH SOURCE & REFERENCE'
                  : 'CORRECT OUT-OF-BOUND METADATA VALUES TO PROCEED'}
              </span>
            </div>
          )}
        </div>

        <button
          disabled={!isReadyToRun}
          onClick={onRunRegistration}
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
