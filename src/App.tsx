import { useState, useEffect, useRef } from 'react';
import { Background } from './components/common/Background';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingView } from './components/views/LandingView';
import { UploadView } from './components/views/UploadView';
import { ProcessingView } from './components/views/ProcessingView';
import { ResultsView } from './components/views/ResultsView';
import { HistoryView } from './components/views/HistoryView';
import { AboutView } from './components/views/AboutView';
import { 
  getPresetScenarios, 
  generateKeypointDataset, 
  getInitialHistoricalRuns 
} from './utils/mockDataGenerator';
import { runRegistrationApi, checkBackendHealth } from './utils/api';
import type { 
  PresetScenario, 
  ImageMetadata, 
  RegistrationMetrics, 
  KeypointMatch, 
  HistoricalRun 
} from './types/registration';

export function App() {
  const [presets] = useState<PresetScenario[]>(() => getPresetScenarios());
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'processing' | 'results' | 'history' | 'about'>('landing');

  // Automatically scroll to top on page/view navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentView]);

  const [activePresetId, setActivePresetId] = useState<string>('preset_clavius_basin');
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);

  // Check backend health on startup
  useEffect(() => {
    checkBackendHealth().then(setIsBackendLive);
  }, []);

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
  const [taskRunId, setTaskRunId] = useState<string>(() => `TASK-${Date.now()}`);
  const [isPipelineComplete, setIsPipelineComplete] = useState<boolean>(false);

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
    setTaskRunId(`TASK-${preset.id}-${Date.now()}`);
    setIsPipelineComplete(false);
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

  const registrationPromiseRef = useRef<Promise<void> | null>(null);

  // Trigger Registration Sequence
  const handleRunRegistration = async () => {
    setTaskRunId(`TASK-${Date.now()}`);
    setIsPipelineComplete(false);
    setCurrentView('processing');

    const promise = (async () => {
      try {
        const apiResult = await runRegistrationApi(sourceMeta, referenceMeta);
        setKeypointData({
          metrics: apiResult.metrics,
          keypoints: apiResult.keypoints
        });
        setIsBackendLive(true);
      } catch (err) {
        console.warn("Python backend API offline or returned error — falling back to simulation dataset:", err);
        setIsBackendLive(false);

        const randomSeed = Math.floor(Math.random() * 99999);
        const count = Math.floor(300 + Math.random() * 150);
        const inlierRatio = parseFloat((0.82 + Math.random() * 0.12).toFixed(2));
        const generated = generateKeypointDataset(600, 600, count, inlierRatio, randomSeed);
        setKeypointData(generated);
      }
    })();

    registrationPromiseRef.current = promise;
    await promise;
  };

  // Prepare results run without changing active view
  const handleResultsReady = async () => {
    if (registrationPromiseRef.current) {
      await registrationPromiseRef.current;
    }

    setHasResults(true);

    setKeypointData(currentKeypointData => {
      const newRun: HistoricalRun = {
        id: `RUN-${new Date().getFullYear()}-CH2-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `${sourceMeta.sensorType} ↔ ${referenceMeta.sensorType} Co-Registration`,
        targetFeature: `Lunar Coordinates (${sourceMeta.centerCoordinates.lat}°, ${sourceMeta.centerCoordinates.lon}°)`,
        timestamp: new Date().toUTCString().replace('GMT', 'UTC'),
        sourceMeta,
        referenceMeta,
        metrics: currentKeypointData.metrics,
        keypoints: currentKeypointData.keypoints
      };

      setHistoricalRuns(prev => {
        if (prev.some(r => r.id === newRun.id)) return prev;
        return [newRun, ...prev];
      });

      return currentKeypointData;
    });
  };

  // Explicit user transition to results view
  const handleGoToResults = async () => {
    await handleResultsReady();
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
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col relative selection:bg-white/20 selection:text-white">
      {/* Background Spacecraft Orbital Imagery & Starfield */}
      <Background />

      {/* Mission Control Top Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onSelectPreset={handleSelectPreset}
        presets={presets}
        activePresetId={activePresetId}
        hasResults={hasResults}
        isBackendLive={isBackendLive}
      />

      {/* Main Content Area */}
      <main className="flex-1 z-10 px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'landing' && (
          <LandingView
            onStartRegistration={() => setCurrentView('upload')}
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
            onComplete={handleGoToResults}
            onResultsReady={handleResultsReady}
            metrics={keypointData.metrics}
            taskRunId={taskRunId}
            isAlreadyCompleted={isPipelineComplete}
            onMarkCompleted={() => setIsPipelineComplete(true)}
          />
        )}

        {currentView === 'results' && (
          <ResultsView
            sourceMeta={sourceMeta}
            referenceMeta={referenceMeta}
            metrics={keypointData.metrics}
            keypoints={keypointData.keypoints}
            onStartNewRun={() => setCurrentView('upload')}
            onViewHistory={() => setCurrentView('history')}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            runs={historicalRuns}
            onLoadRun={handleLoadHistoricalRun}
            onNewRun={() => setCurrentView('upload')}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onStartRegistration={() => setCurrentView('upload')}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}
      </main>

      {/* Full-Fledged Commercial & Institutional Footer */}
      <Footer onNavigate={setCurrentView} />
    </div>
  );
}

export default App;
