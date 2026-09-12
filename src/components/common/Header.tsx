import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Radio, 
  Layers, 
  Cpu, 
  BarChart3, 
  History, 
  Home,
  ChevronRight
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import type { PresetScenario } from '../../types/registration';

interface HeaderProps {
  currentView: 'landing' | 'upload' | 'processing' | 'results' | 'history';
  onNavigate: (view: 'landing' | 'upload' | 'processing' | 'results' | 'history') => void;
  onSelectPreset: (preset: PresetScenario) => void;
  presets: PresetScenario[];
  activePresetId?: string;
  hasResults: boolean;
}

interface NavItem {
  id: 'landing' | 'upload' | 'processing' | 'results' | 'history';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  disabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onSelectPreset,
  presets,
  activePresetId,
  hasResults
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.isMuted);
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  const navItems: NavItem[] = [
    { id: 'landing', label: 'Briefing', icon: Home, badge: '01', disabled: false },
    { id: 'upload', label: 'Sensor Ingestion', icon: Layers, badge: '02', disabled: false },
    { id: 'processing', label: 'Pipeline Engine', icon: Cpu, badge: '03', disabled: false },
    { id: 'results', label: 'Results Telemetry', icon: BarChart3, badge: '04', disabled: !hasResults },
    { id: 'history', label: 'Mission Archive', icon: History, badge: '05', disabled: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/90 backdrop-blur-xl">
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-1 bg-obsidian-900/90 text-[11px] font-mono border-b border-white/5 text-regolith-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-telemetry-green beacon-live"></span>
            <span className="text-regolith-200 font-medium tracking-wide">System Online</span>
          </div>
          <span className="hidden sm:inline text-regolith-700">|</span>
          <span className="hidden sm:inline text-regolith-300">
            ISRO Chandrayaan-2
          </span>
          <span className="hidden md:inline text-regolith-700">|</span>
          <span className="hidden md:inline text-regolith-400">
            AI Image Alignment
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 text-regolith-400">
            <Radio className="w-3.5 h-3.5 text-telemetry-green animate-pulse" />
            <span>LINK: <span className="text-telemetry-green">LOCKED</span></span>
          </div>
          <span className="text-regolith-700 hidden sm:inline">|</span>
          <span className="text-regolith-200 tracking-wider font-mono">{utcTime}</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Project title */}
        <div 
          onClick={() => { soundFx.playClick(); onNavigate('landing'); }}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-obsidian-800 border border-white/15 group-hover:border-white/30 transition-all duration-200 shadow-instrument">
            <Compass className="w-4 h-4 text-regolith-100 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-sm sm:text-base text-white font-display">
                ChandraDrishti
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-regolith-300 border border-white/10 uppercase tracking-wider">
                ISRO SAC
              </span>
            </div>
            <p className="text-[10px] text-regolith-400 hidden sm:block font-mono">
              Lunar Image Registration & Invariant Vision Engine
            </p>
          </div>
        </div>

        {/* View Navigation Pills */}
        <nav className="flex items-center p-0.5 rounded-lg bg-obsidian-850 border border-white/10 shadow-inner overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => {
                  soundFx.playClick();
                  onNavigate(item.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-regolith-800 text-white border border-white/20 shadow-sm font-semibold'
                    : item.disabled
                    ? 'text-regolith-700 cursor-not-allowed opacity-40'
                    : 'text-regolith-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-[9px] opacity-50">{item.badge}</span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-regolith-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Preset Selector dropdown */}
          <div className="relative group">
            <button
              onClick={() => soundFx.playClick()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-obsidian-850 border border-white/15 hover:border-white/30 text-xs font-mono text-regolith-200 hover:text-white transition-all shadow-sm"
            >
              <span className="hidden sm:inline">Preset Targets</span>
              <span className="sm:hidden">Presets</span>
              <ChevronRight className="w-3 h-3 text-regolith-400 group-hover:rotate-90 transition-transform duration-150" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-72 p-1.5 rounded-xl mission-card border border-white/15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 shadow-2xl z-50">
              <div className="text-[9px] font-mono text-regolith-400 px-2 py-1 uppercase tracking-wider border-b border-white/10 mb-1">
                Verified Planetary Test Cases
              </div>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectPreset(preset);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all flex flex-col gap-0.5 hover:bg-white/10 ${
                    activePresetId === preset.id ? 'bg-white/10 border border-white/20 text-white font-semibold' : 'text-regolith-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{preset.title}</span>
                    <span className="text-[9px] text-regolith-300 px-1 py-0.2 rounded bg-white/5 border border-white/10">
                      {preset.difficulty}
                    </span>
                  </div>
                  <span className="text-[10px] text-regolith-400 truncate">
                    {preset.sourceMeta.sensorType} ↔ {preset.referenceMeta.sensorType}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound Synthesizer Mute Toggle */}
          <button
            onClick={handleSoundToggle}
            title={isMuted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
            className={`p-1.5 rounded-lg border transition-all ${
              isMuted
                ? 'bg-obsidian-900 border-white/10 text-regolith-600 hover:text-regolith-300'
                : 'bg-obsidian-800 border-white/20 text-regolith-200 hover:text-white'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
