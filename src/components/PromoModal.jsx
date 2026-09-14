import React from 'react';
import { ArrowUpRightIcon, CloseIcon } from './InlineIcons';

const getPriceLabel = (product) => {
  if (!product) return '';

  if (product.variants?.length) {
    const prices = product.variants.map((variant) => Number(variant.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min} TL` : `${min} TL'den`;
  }

  return `${product.price} TL`;
};

const PromoModal = ({ promo, product, category, onClose, onGoToProduct }) => {
  const accent = category?.accentColor || '#C5A059';
  const image = promo?.image || product?.image || '/hero_cup.png';
  const promoTitle = promo?.title || '';
  const productName = product?.name || '';
  const title = promoTitle || productName || 'İpek Gold Önerisi';
  const subtitle = promoTitle && productName ? productName : '';
  const description = promo?.description || product?.desc || product?.aroma || '';
  const buttonLabel = promo?.buttonLabel || 'İncele';

  const handleShortcut = () => {
    if (product) onGoToProduct();
    else onClose();
  };

  return (
    <div
      className="ipek-modal-backdrop-enter fixed inset-0 z-[92] flex items-center justify-center px-5 py-7"
      style={{ background: 'rgba(42,36,33,0.34)' }}
      onClick={onClose}
    >
      <div
        data-ipek-promo="open"
        role="dialog"
        aria-modal="true"
        className="ipek-pop-enter relative w-full max-w-[380px] overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-2xl shadow-black/22"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#2A2421] shadow-lg shadow-black/10 transition active:scale-95"
          aria-label="Kapat"
        >
          <CloseIcon size={18} />
        </button>

        <button type="button" onClick={handleShortcut} className="block w-full text-left">
          <div className="relative aspect-[1.45] bg-[#FDFBF7] p-5">
            <div
              className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] shadow-sm"
              style={{ color: accent }}
            >
              Reklam
            </div>
            <img src={image} alt="" className="h-full w-full object-contain" loading="eager" decoding="async" />
          </div>

          <div className="p-5 pt-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
              {category?.label || 'İpek Gold'}
            </p>
            <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-[#2A2421]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm font-black" style={{ color: accent }}>
                {subtitle}
              </p>
            )}
            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-gray-500">
              {description || product?.name || 'Menü önerisi'}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              {product ? (
                <span className="text-xl font-black" style={{ color: accent }}>
                  {getPriceLabel(product)}
                </span>
              ) : (
                <span />
              )}
              <span className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2A2421] px-4 text-sm font-black text-white">
                {buttonLabel}
                <ArrowUpRightIcon size={16} />
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PromoModal;
