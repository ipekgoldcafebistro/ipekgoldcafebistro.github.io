import React from 'react';
import ProductImage from './ProductImage';
import { ArrowUpRightIcon, SparklesIcon } from './InlineIcons';

const getPriceLabel = (product) => {
  if (product.variants?.length) {
    const prices = product.variants.map((variant) => Number(variant.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min} TL` : `${min} TL'den`;
  }

  return `${product.price} TL`;
};

const ProductCard = ({ product, index, onOpen, accentColor, eyebrow }) => {
  const themeGold = accentColor || '#C5A059';
  const themeCharcoal = '#2A2421';
  const detail = product.desc || product.aroma || 'İpek Gold seçkisi';
  const isAvailable = product.isAvailable !== false;

  return (
    <button
      type="button"
      className={`editorial-card group w-full mb-4 text-left overflow-hidden ${isAvailable ? 'ipek-pressable cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
      onClick={() => {
        if (isAvailable) onOpen(product);
      }}
      disabled={!isAvailable}
      style={{
        borderColor: isAvailable ? `${themeGold}26` : 'rgba(42,36,33,0.08)',
        filter: isAvailable ? 'none' : 'saturate(0.72)',
        contentVisibility: 'auto',
        containIntrinsicSize: '132px',
      }}
    >
      <div className="flex items-center gap-4 p-3 pr-4">
        <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-[22px] overflow-hidden bg-white">
          <div className="ipek-card-image h-full w-full">
            <ProductImage
              product={product}
              alt={product.name}
              className={`h-full w-full ${isAvailable ? '' : 'grayscale opacity-60'}`}
              loading={index < 5 ? 'eager' : 'lazy'}
              fetchPriority={index < 5 ? 'high' : 'auto'}
            />
          </div>

          {!isAvailable && (
            <div className="absolute inset-x-2 bottom-2 rounded-full bg-[#2A2421]/88 px-2 py-1 text-center shadow-sm">
              <span className="text-[0.56rem] font-black uppercase tracking-[0.1em] text-white">
                Bugün yok
              </span>
            </div>
          )}

          {product.isNew && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/92 px-2 py-1 shadow-sm">
              <SparklesIcon size={11} color={themeGold} strokeWidth={2.5} />
              <span
                style={{
                  color: themeGold,
                  fontSize: '0.56rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Yeni
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 py-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span
              style={{
                color: themeGold,
                fontSize: '0.58rem',
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow || product.tag || product.aroma || 'Menü'}
            </span>
            {product.variants?.length > 1 && (
              <span
                style={{
                  color: themeGold,
                  background: `${themeGold}12`,
                  border: `1px solid ${themeGold}24`,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  fontSize: '0.54rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {product.variants.length} seçenek
              </span>
            )}
          </div>

          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1rem, 4.2vw, 1.28rem)',
              fontWeight: 800,
              color: themeCharcoal,
              lineHeight: 1.15,
              marginBottom: 6,
              letterSpacing: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              fontSize: 'clamp(0.72rem, 2.5vw, 0.82rem)',
              color: 'rgba(42,36,33,0.74)',
              fontWeight: 500,
              lineHeight: 1.42,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {detail}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(1rem, 4vw, 1.14rem)',
                fontWeight: 900,
                color: isAvailable ? themeGold : 'rgba(42,36,33,0.42)',
                letterSpacing: 0,
              }}
            >
              {isAvailable ? getPriceLabel(product) : 'Bugün yok'}
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform ${isAvailable ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`}
              style={{
                background: isAvailable ? `${themeGold}14` : 'rgba(42,36,33,0.06)',
                color: isAvailable ? themeGold : 'rgba(42,36,33,0.32)',
                border: `1px solid ${isAvailable ? `${themeGold}24` : 'rgba(42,36,33,0.08)'}`,
              }}
              aria-hidden="true"
            >
              <ArrowUpRightIcon size={17} strokeWidth={2.4} />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default React.memo(ProductCard);
