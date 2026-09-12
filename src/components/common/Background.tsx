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

      {/* Very subtle edge tint only at top and bottom to seamlessly integrate Header & Footer */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Dynamic Twinkling Starfield */}
      <Starfield />
    </div>
  );
};

export default Background;
