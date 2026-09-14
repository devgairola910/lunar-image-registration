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
      {/* Authentic High-Visibility Spacecraft Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{
          backgroundImage: 'url(/spacecraft_background.jpg)',
          opacity: Math.min(Math.max(opacity, 0), 1),
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      {/* Dynamic Twinkling Starfield */}
      <Starfield />
    </div>
  );
};

export default Background;
