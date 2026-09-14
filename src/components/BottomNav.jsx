import React, { useEffect, useRef } from 'react';
import { useMenuStore } from '../hooks/useMenuStore';

const BottomNav = ({ activeCategory, onSelect }) => {
  const { menu } = useMenuStore();
  const navItems = menu.categories;
  const itemRefs = useRef({});
  const navRef = useRef(null);

  useEffect(() => {
    const activeEl = itemRefs.current[activeCategory];
    const navEl = navRef.current;
    if (!activeEl || !navEl) return;

    const navWidth = navEl.offsetWidth;
    const itemLeft = activeEl.offsetLeft;
    const itemWidth = activeEl.offsetWidth;
    const targetScroll = itemLeft - navWidth / 2 + itemWidth / 2;

    navEl.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }, [activeCategory]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60]"
      style={{
        pointerEvents: 'auto',
        background: 'rgba(253, 251, 247, 0.96)',
        borderTop: '1px solid rgba(42, 36, 33, 0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.03)',
      }}
    >
      <nav
        ref={navRef}
        className="ipek-nav-enter flex items-center overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          gap: '4px',
          padding: '6px 12px',
        }}
        aria-label="Menü kategorileri"
      >
        {navItems.map((item) => {
          const isActive = activeCategory === item.id;
          const accent = item.accentColor || '#C5A059';

          return (
            <button
              key={item.id}
              ref={(el) => { itemRefs.current[item.id] = el; }}
              type="button"
              onClick={() => onSelect(item.id)}
              className="ipek-pressable"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                minWidth: '64px',
                padding: '8px 14px',
                background: isActive ? `${accent}14` : 'transparent',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'background 0.25s ease',
                gap: '5px',
              }}
            >
              <span
                style={{
                  fontSize: '1.55rem',
                  lineHeight: 1,
                  filter: isActive ? `drop-shadow(0 3px 6px ${accent}40)` : 'grayscale(0.3) opacity(0.65)',
                  transform: isActive ? 'translateY(-2px) scale(1.12)' : 'translateY(0) scale(1)',
                  transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), filter 0.25s ease',
                }}
              >
                {item.emoji}
              </span>
              <span
                style={{
                  color: isActive ? accent : 'rgba(42,36,33,0.55)',
                  fontSize: '0.68rem',
                  fontWeight: isActive ? 800 : 600,
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  textAlign: 'center',
                  transition: 'color 0.25s ease, font-weight 0.25s ease',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
