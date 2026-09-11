import React from 'react';

interface ReticleFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
  badgeColor?: 'blue' | 'teal' | 'amber' | 'purple' | 'rose' | 'neutral';
  glow?: boolean;
  cornerColor?: string;
  headerRight?: React.ReactNode;
}

export const ReticleFrame: React.FC<ReticleFrameProps> = ({
  children,
  className = '',
  title,
  badge,
  badgeColor = 'neutral',
  glow = false,
  headerRight
}) => {
  const badgeColors = {
    neutral: 'bg-white/5 text-regolith-300 border-white/10',
    blue: 'bg-earth-500/10 text-earth-300 border-earth-500/20',
    teal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    purple: 'bg-white/10 text-regolith-200 border-white/15',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div
      className={`relative rounded-xl p-5 ${
        glow ? 'mission-card-glow' : 'mission-card'
      } hud-bracket transition-all duration-200 ${className}`}
    >
      {/* Corner brackets styled via CSS */}
      {(title || badge || headerRight) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            {title && (
              <h3 className="text-xs font-semibold font-mono tracking-wider uppercase text-regolith-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-regolith-400 inline-block"></span>
                {title}
              </h3>
            )}
            {badge && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColors[badgeColor]}`}
              >
                {badge}
              </span>
            )}
          </div>
          {headerRight && <div className="flex items-center space-x-2">{headerRight}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
