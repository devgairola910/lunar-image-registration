import React from 'react';
import { 
  Layers, 
  Cpu, 
  BarChart3, 
  History, 
  Home,
  ChevronRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import type { PresetScenario } from '../../types/registration';

interface HeaderProps {
  currentView: 'landing' | 'upload' | 'processing' | 'results' | 'history' | 'about';
  onNavigate: (view: 'landing' | 'upload' | 'processing' | 'results' | 'history' | 'about') => void;
  onSelectPreset: (preset: PresetScenario) => void;
  presets: PresetScenario[];
  activePresetId?: string;
  hasResults: boolean;
}

interface NavItem {
  id: 'landing' | 'upload' | 'processing' | 'results' | 'history' | 'about';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
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
  const navItems: NavItem[] = [
    { id: 'landing', label: 'Mission Briefing', icon: Home, disabled: false },
    { id: 'upload', label: 'Sensor Ingestion', icon: Layers, disabled: false },
    { id: 'processing', label: 'Pipeline Engine', icon: Cpu, disabled: false },
    { id: 'results', label: 'Results Telemetry', icon: BarChart3, disabled: !hasResults },
    { id: 'history', label: 'Mission Archive', icon: History, disabled: false },
    { id: 'about', label: 'About Mission', icon: Info, disabled: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/15 bg-black/92 backdrop-blur-2xl shadow-xl">
      {/* Official Government of India & ISRO Departmental Header Banner */}
      <div className="border-b border-white/10 bg-obsidian-900/90 px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-regolith-400">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <img 
            src="/emblem-white.png" 
            alt="State Emblem of India" 
            className="h-4.5 w-auto object-contain opacity-90 select-none" 
          />
          <span className="font-semibold text-regolith-200 tracking-wide">
            भारत सरकार | Government of India
          </span>
          <span className="text-regolith-600 hidden sm:inline">•</span>
          <span className="text-regolith-300 hidden sm:inline">
            अंतरिक्ष विभाग | Department of Space
          </span>
          <span className="text-regolith-600 hidden md:inline">•</span>
          <span className="text-earth-400 font-semibold hidden md:inline">
            भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[10px] sm:text-[11px]">
          <span className="hidden lg:inline text-regolith-300">Space Applications Centre (SAC), Ahmedabad</span>
          <span className="text-regolith-600 hidden lg:inline">•</span>
          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-regolith-200">
            <ShieldCheck className="w-3 h-3 text-regolith-300" />
            <span>PDS4 COMPLIANT // SPICE IAU-2015</span>
          </div>
        </div>
      </div>

      {/* Main Agency Navigation Bar */}
      <div className="px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Mission Crest */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/95 border-2 border-white/30 p-1 group-hover:border-white/80 transition-all duration-200 shadow-xl group-hover:scale-105 overflow-hidden flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="ISRO ChandraDrishti Emblem" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-extrabold tracking-tight text-lg sm:text-2xl text-white font-display">
                ChandraDrishti
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold border border-white/20 uppercase tracking-wider shadow-sm">
                ISRO SAC
              </span>
            </div>
            <p className="text-xs text-regolith-300 font-mono tracking-normal line-clamp-1">
              Lunar Orbital Photogrammetry & Georeferencing Portal
            </p>
          </div>
        </div>

        {/* View Navigation Pills */}
        <nav className="flex items-center p-1 rounded-xl bg-obsidian-850 border border-white/15 shadow-inner overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg text-xs font-mono transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-regolith-800 text-white border border-white/30 shadow-md font-bold'
                    : item.disabled
                    ? 'text-regolith-700 cursor-not-allowed opacity-35'
                    : 'text-regolith-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-regolith-400'}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions: Planetary Presets */}
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <button
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/20 hover:border-white/40 text-xs font-mono text-regolith-100 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-regolith-300" />
              <span className="font-semibold">Preset Targets</span>
              <ChevronRight className="w-3.5 h-3.5 text-regolith-300 group-hover:rotate-90 transition-transform duration-150" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-80 p-2 rounded-xl mission-card border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 shadow-2xl z-50">
              <div className="text-[10px] font-mono text-regolith-300 px-2 py-1.5 uppercase tracking-wider border-b border-white/10 mb-1.5 flex items-center justify-between">
                <span>Verified Orbital Baselines</span>
                <span className="text-earth-400 font-semibold">3 PRESETS</span>
              </div>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-all flex flex-col gap-1 hover:bg-white/10 cursor-pointer ${
                    activePresetId === preset.id ? 'bg-white/15 border border-white/30 text-white font-bold' : 'text-regolith-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{preset.title}</span>
                    <span className="text-[9px] text-regolith-200 px-1.5 py-0.5 rounded bg-white/10 border border-white/15">
                      {preset.difficulty}
                    </span>
                  </div>
                  <span className="text-[11px] text-regolith-400 truncate">
                    {preset.sourceMeta.sensorType} ↔ {preset.referenceMeta.sensorType}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
