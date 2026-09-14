import React from 'react';
import { Starfield } from './Starfield';

interface BackgroundProps {
  opacity?: number;
  className?: string;
}

export const Background: React.FC<BackgroundProps> = ({
  opacity = 1,
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}>
      {/* Authentic High-Visibility Spacecraft Background Image with dimming */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{
          backgroundImage: 'url(/spacecraft_background.jpg)',
          opacity: Math.min(Math.max(opacity, 0), 1) * 0.35,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      {/* Global cosmic dark overlays ensuring maximum contrast for all text & UI controls */}
      <div className="absolute inset-0 bg-obsidian-950/75 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-obsidian-950/50 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-obsidian-950/40 to-black/95 pointer-events-none" />

      {/* Edge gradient blends */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

      {/* Dynamic Twinkling Starfield */}
      <Starfield />
    </div>
  );
};

export default Background;
