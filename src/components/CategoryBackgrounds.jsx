import React from 'react';

const baseLayer = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  zIndex: 1,
  pointerEvents: 'none',
};

const StaticOrnaments = ({ color, variant = 'soft' }) => (
  <div className="gpu-layer" style={baseLayer}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          variant === 'top'
            ? `radial-gradient(circle at 50% 0%, ${color}20 0%, transparent 72%)`
            : `radial-gradient(circle at 50% 48%, ${color}12 0%, transparent 76%)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: '-8% -18%',
        background: `radial-gradient(circle at 18% 18%, ${color}10 0%, transparent 42%), radial-gradient(circle at 86% 76%, ${color}0D 0%, transparent 38%)`,
        opacity: variant === 'soft' ? 0.72 : 0.9,
      }}
    />
  </div>
);

export const SteamBackground = ({ color = '#C5A059' }) => (
  <div className="gpu-layer" style={baseLayer}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 48%, ${color}12 0%, transparent 76%)`,
      }}
    />
  </div>
);

export const BubbleBackground = ({ color = '#3498db' }) => (
  <div className="gpu-layer" style={baseLayer}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 100%, ${color}20 0%, transparent 76%)`,
      }}
    />
    {[16, 28, 40, 52, 68].map((left, index) => (
      <div
        key={left}
        style={{
          position: 'absolute',
          width: 22 + index * 7,
          height: 22 + index * 7,
          borderRadius: '50%',
          border: `1px solid ${color}22`,
          left: `${left}%`,
          bottom: `${12 + index * 15}%`,
          opacity: 0.44,
        }}
      />
    ))}
  </div>
);

export const DessertBackground = ({ color = '#e67e22' }) => (
  <div className="gpu-layer" style={baseLayer}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 0%, ${color}20 0%, transparent 78%)`,
      }}
    />
    <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0,0 Q25,24 50,0 T100,0 V26 Q75,44 50,26 T0,26 Z" fill={color} />
    </svg>
  </div>
);

export const AuroraBackground = ({ color = '#9b59b6' }) => (
  <StaticOrnaments color={color} variant="soft" />
);

export const NeonRingsBackground = ({ color = '#e91e63' }) => (
  <div className="gpu-layer" style={baseLayer}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 48%, ${color}18 0%, transparent 72%)`,
      }}
    />
    {[180, 310, 440].map((size) => (
      <div
        key={size}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size,
          height: size,
          borderRadius: '50%',
          border: `1px solid ${color}1F`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    ))}
  </div>
);

export const StarBackground = ({ color = '#f1c40f' }) => (
  <div className="gpu-layer" style={baseLayer}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 42%, ${color}12 0%, transparent 72%)`,
      }}
    />
    {Array.from({ length: 16 }, (_, index) => {
      const left = 5 + ((index * 37) % 90);
      const top = 7 + ((index * 23) % 86);
      const size = 1 + ((index * 11) % 3);

      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            left: `${left}%`,
            top: `${top}%`,
            opacity: 0.42,
          }}
        />
      );
    })}
  </div>
);
