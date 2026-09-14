import React from 'react';

const CoffeeBackdrop = ({ opacity = 0.18 }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 50% 24%, rgba(197,160,89,0.18), transparent 32%), radial-gradient(circle at 50% 78%, rgba(197,160,89,0.08), transparent 44%), linear-gradient(135deg, rgba(255,255,255,0.9), rgba(253,251,247,0.62))',
        opacity: Math.min(opacity + 0.2, 0.46),
      }}
    />
  </div>
);

export default CoffeeBackdrop;
