import React from 'react';
import ProductImage from './ProductImage';
import { ChevronDownIcon, CloseIcon, SparklesIcon } from './InlineIcons';

const getPriceLabel = (product) => {
  if (product.variants?.length) {
    const prices = product.variants.map((variant) => Number(variant.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min} TL` : `${min} TL'den`;
  }

  return `${product.price} TL`;
};

const ProductModal = ({ product, category, onClose }) => {
  const themeGold = category?.accentColor || '#C5A059';
  const themeCharcoal = '#2A2421';

  if (!product) return null;

  return (
    <div
      key="modal-backdrop"
      className="ipek-modal-backdrop-enter fixed inset-0 z-[80] flex flex-col justify-end"
      style={{ background: 'rgba(42, 36, 33, 0.42)' }}
      onClick={onClose}
    >
      <div
        key="modal-card"
        className="ipek-modal-sheet-enter relative mx-auto flex w-full flex-col overflow-hidden rounded-t-[34px]"
        style={{
          maxWidth: 520,
          maxHeight: '93dvh',
          background: '#FFFFFF',
          boxShadow: '0 -24px 70px rgba(42,36,33,0.18)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute left-0 right-0 top-0 z-30 flex justify-center pt-4" style={{ pointerEvents: 'none' }}>
          <div className="flex h-7 items-center rounded-full bg-white/88 px-3 shadow-sm">
            <ChevronDownIcon size={18} color="rgba(42,36,33,0.44)" />
          </div>
        </div>

        <div className="relative w-full flex-shrink-0" style={{ height: 'clamp(250px, 48vw, 360px)' }}>
          <div className="ipek-soft-enter h-full w-full">
            <ProductImage product={product} alt={product.name} className="h-full w-full" loading="eager" fetchPriority="high" />
          </div>

          <div className="absolute left-5 top-5 z-20 flex flex-wrap gap-2 pr-16">
            <span
              className="flex items-center gap-1 rounded-full px-3 py-1.5 shadow-sm"
              style={{ background: themeGold, color: '#fff' }}
            >
              <SparklesIcon size={13} strokeWidth={2.5} />
              <span style={{ fontSize: '0.64rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {category?.label || product.tag || 'Ipek Gold'}
              </span>
            </span>
            {product.isNew && (
              <span className="rounded-full bg-white px-3 py-1.5 text-[0.64rem] font-black uppercase tracking-[0.08em] shadow-sm" style={{ color: themeGold }}>
                Yeni
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex items-center justify-center transition-transform active:scale-90"
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              color: themeCharcoal,
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Kapat"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="ipek-stagger overflow-y-auto px-6 pb-7" style={{ flex: 1 }}>
          <div className="mt-4 flex flex-col gap-2 text-center">
            <span style={{ color: themeGold, fontSize: '1.45rem', fontWeight: 900, fontFamily: "'Inter', sans-serif" }}>
              {getPriceLabel(product)}
            </span>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.75rem, 7vw, 2.45rem)',
                fontWeight: 800,
                color: themeCharcoal,
                lineHeight: 1.08,
                letterSpacing: 0,
              }}
            >
              {product.name}
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-12 rounded-full" style={{ background: themeGold }} />
          </div>

          {(product.desc || product.aroma) && (
            <p
              className="mx-auto mt-6 max-w-sm text-center"
              style={{ color: 'rgba(42,36,33,0.78)', fontWeight: 500, fontSize: '0.96rem', lineHeight: 1.62 }}
            >
              {product.desc || product.aroma}
            </p>
          )}

          {product.variants?.length > 0 && (
            <div className="mt-7 rounded-[24px] p-4" style={{ background: '#FDFBF7', border: `1px solid ${themeGold}20` }}>
              <p style={{ color: themeGold, fontSize: '0.62rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
                Seçenekler
              </p>
              <div className="grid gap-2">
                {product.variants.map((variant) => (
                  <div
                    key={`${variant.label}-${variant.price}`}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3"
                    style={{ border: '1px solid rgba(42,36,33,0.05)' }}
                  >
                    <span style={{ color: themeCharcoal, fontWeight: 700 }}>{variant.label}</span>
                    <span style={{ color: themeGold, fontWeight: 900 }}>{variant.price} TL</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-[22px] p-4 text-center" style={{ background: `${themeGold}10`, border: `1px solid ${themeGold}1F` }}>
              <p style={{ color: themeGold, fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 7 }}>
                Kategori
              </p>
              <p style={{ color: themeCharcoal, fontSize: '0.92rem', fontWeight: 700 }}>{category?.label || 'Menü'}</p>
            </div>
            <div className="rounded-[22px] p-4 text-center" style={{ background: `${themeGold}10`, border: `1px solid ${themeGold}1F` }}>
              <p style={{ color: themeGold, fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 7 }}>
                Servis
              </p>
              <p style={{ color: themeCharcoal, fontSize: '0.92rem', fontWeight: 700 }}>{product.aroma || 'Ipek Gold'}</p>
            </div>
          </div>

          <p
            className="mb-4 mt-8 text-center"
            style={{
              color: 'rgba(42,36,33,0.58)',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1rem',
              fontStyle: 'italic',
              lineHeight: 1.7,
            }}
          >
            Ipek Gold menüsünde fiyatlar ürünün seçeneğine ve servis tipine göre güncellenebilir.
          </p>
        </div>

        <div className="safe-bottom flex-shrink-0 px-6 pb-7 pt-3" style={{ background: 'linear-gradient(to top, #FFFFFF 82%, rgba(255,255,255,0) 100%)' }}>
          <button
            type="button"
            onClick={onClose}
            className="ipek-pressable flex w-full items-center justify-center rounded-full py-4"
            style={{
              background: themeCharcoal,
              color: '#fff',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              border: `1px solid ${themeGold}40`,
              cursor: 'pointer',
              boxShadow: '0 12px 30px rgba(42,36,33,0.18)',
            }}
          >
            Menüye Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
