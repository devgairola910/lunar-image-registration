import { useState } from 'react';
import { Starfield } from './components/common/Starfield';
import { Header } from './components/common/Header';
import { LandingView } from './components/views/LandingView';
import { UploadView } from './components/views/UploadView';
import { ProcessingView } from './components/views/ProcessingView';
import { ResultsView } from './components/views/ResultsView';
import { HistoryView } from './components/views/HistoryView';
import { 
  getPresetScenarios, 
  generateKeypointDataset, 
  getInitialHistoricalRuns 
} from './utils/mockDataGenerator';
import type { 
  PresetScenario, 
  ImageMetadata, 
  RegistrationMetrics, 
  KeypointMatch, 
  HistoricalRun 
} from './types/registration';
import { soundFx } from './utils/soundEffects';

export function App() {
  const [presets] = useState<PresetScenario[]>(() => getPresetScenarios());
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'processing' | 'results' | 'history'>('landing');
  const [activePresetId, setActivePresetId] = useState<string>('preset_clavius_basin');

  // Source & Reference Image Metadata
  const [sourceMeta, setSourceMeta] = useState<ImageMetadata>(presets[0].sourceMeta);
  const [referenceMeta, setReferenceMeta] = useState<ImageMetadata>(presets[0].referenceMeta);

  // Keypoints and Metrics
  const [keypointData, setKeypointData] = useState<{ keypoints: KeypointMatch[]; metrics: RegistrationMetrics }>(() => 
    generateKeypointDataset(600, 600, 380, 0.88, 42)
  );

  // Historical Runs
  const [historicalRuns, setHistoricalRuns] = useState<HistoricalRun[]>(() => getInitialHistoricalRuns());
  const [hasResults, setHasResults] = useState(true);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetScenario) => {
    setActivePresetId(preset.id);
    setSourceMeta(preset.sourceMeta);
    setReferenceMeta(preset.referenceMeta);

    // Generate specific seed dataset for this scenario
    const seed = preset.id.includes('clavius') ? 101 : preset.id.includes('tycho') ? 202 : 303;
    const count = preset.id.includes('clavius') ? 420 : preset.id.includes('tycho') ? 310 : 275;
    const inlierRatio = preset.id.includes('clavius') ? 0.89 : preset.id.includes('tycho') ? 0.84 : 0.91;

    const data = generateKeypointDataset(600, 600, count, inlierRatio, seed);
    setKeypointData(data);
    setHasResults(true);
    setCurrentView('upload');
  };

  // Update Source metadata
  const handleUpdateSourceMeta = (updated: Partial<ImageMetadata>) => {
    setSourceMeta(prev => ({ ...prev, ...updated }));
  };

  // Update Reference metadata
  const handleUpdateRefMeta = (updated: Partial<ImageMetadata>) => {
    setReferenceMeta(prev => ({ ...prev, ...updated }));
  };

  // Reset to default
  const handleResetToDefault = () => {
    handleSelectPreset(presets[0]);
  };

  // Trigger Registration Sequence
  const handleRunRegistration = () => {
    // Generate fresh keypoints and metrics
    const randomSeed = Math.floor(Math.random() * 99999);
    const count = Math.floor(300 + Math.random() * 150);
    const inlierRatio = parseFloat((0.82 + Math.random() * 0.12).toFixed(2));
    const generated = generateKeypointDataset(600, 600, count, inlierRatio, randomSeed);
    setKeypointData(generated);

    setCurrentView('processing');
  };

  // Processing Completed -> Store run and go to Results
  const handleProcessingComplete = () => {
    setHasResults(true);

    // Append to historical runs
    const newRun: HistoricalRun = {
      id: `RUN-${new Date().getFullYear()}-CH2-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${sourceMeta.sensorType} ↔ ${referenceMeta.sensorType} Co-Registration`,
      targetFeature: `Lunar Coordinates (${sourceMeta.centerCoordinates.lat}°, ${sourceMeta.centerCoordinates.lon}°)`,
      timestamp: new Date().toUTCString().replace('GMT', 'UTC'),
      sourceMeta,
      referenceMeta,
      metrics: keypointData.metrics,
      keypoints: keypointData.keypoints
    };

    setHistoricalRuns(prev => [newRun, ...prev]);
    setCurrentView('results');
  };

  // Load a historical run into the active view
  const handleLoadHistoricalRun = (run: HistoricalRun) => {
    setSourceMeta(run.sourceMeta);
    setReferenceMeta(run.referenceMeta);
    setKeypointData({
      keypoints: run.keypoints,
      metrics: run.metrics
    });
    setHasResults(true);
    setCurrentView('results');
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col relative selection:bg-electron-500/30 selection:text-electron-300">
      {/* Background Twinkling Starfield */}
      <Starfield />

      {/* Mission Control Top Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onSelectPreset={handleSelectPreset}
        presets={presets}
        activePresetId={activePresetId}
        hasResults={hasResults}
      />

      {/* Main Content Area */}
      <main className="flex-1 z-10 px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'landing' && (
          <LandingView
            onStartRegistration={() => {
              soundFx.playClick();
              setCurrentView('upload');
            }}
            onSelectPreset={handleSelectPreset}
            presets={presets}
          />
        )}

        {currentView === 'upload' && (
          <UploadView
            sourceMeta={sourceMeta}
            referenceMeta={referenceMeta}
            onUpdateSourceMeta={handleUpdateSourceMeta}
            onUpdateRefMeta={handleUpdateRefMeta}
            onRunRegistration={handleRunRegistration}
            onSelectPreset={handleSelectPreset}
            presets={presets}
            activePresetId={activePresetId}
            onResetToDefault={handleResetToDefault}
          />
        )}

        {currentView === 'processing' && (
          <ProcessingView
            sourceMeta={sourceMeta}
            referenceMeta={referenceMeta}
            onComplete={handleProcessingComplete}
            metrics={keypointData.metrics}
          />
        )}

        {currentView === 'results' && (
          <ResultsView
            sourceMeta={sourceMeta}
            referenceMeta={referenceMeta}
            metrics={keypointData.metrics}
            keypoints={keypointData.keypoints}
            onStartNewRun={() => {
              soundFx.playClick();
              setCurrentView('upload');
            }}
            onViewHistory={() => {
              soundFx.playClick();
              setCurrentView('history');
            }}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            runs={historicalRuns}
            onLoadRun={handleLoadHistoricalRun}
            onNewRun={() => {
              soundFx.playClick();
              setCurrentView('upload');
            }}
          />
        )}
      </main>

      {/* Mission Control Footer */}
      <footer className="z-10 border-t border-white/10 bg-space-950/80 backdrop-blur-md py-6 px-4 sm:px-8 mt-auto text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-mission-teal"></span>
            <span className="text-slate-300 font-bold">CHANDRADRISHTI PROTOCOL v2.4</span>
            <span>•</span>
            <span>ISRO CHANDRAYAAN LUNAR CORRESPONDENCE NODE (SAC / ISSDC)</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>SPICE KERNEL IAU-2015</span>
            <span>•</span>
            <span>MAGSAC++ / LoFTR-LUNAR</span>
            <span>•</span>
            <span className="text-electron-400">SUB-PIXEL OPTIMIZED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
