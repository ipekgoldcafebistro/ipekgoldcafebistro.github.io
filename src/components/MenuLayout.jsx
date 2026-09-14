import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { COPYRIGHT_LABEL } from '../constants/branding';
import { useMenuStore } from '../hooks/useMenuStore';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import PromoModal from './PromoModal';
import BottomNav from './BottomNav';
import CoffeeBackdrop from './CoffeeBackdrop';
import { CloseIcon, SearchIcon } from './InlineIcons';
import {
  AuroraBackground,
  BubbleBackground,
  DessertBackground,
  NeonRingsBackground,
  StarBackground,
  SteamBackground,
} from './CategoryBackgrounds';

const CategoryBackground = ({ category, color }) => {
  switch (category.id) {
    case 'soguk':
      return <BubbleBackground color={color} />;
    case 'lezzetler':
    case 'menuler':
      return <AuroraBackground color={color} />;
    case 'pizzalar':
      return <NeonRingsBackground color={color} />;
    case 'tatlilar':
      return <DessertBackground color={color} />;
    case 'kuruyemis':
    case 'diger':
      return <StarBackground color={color} />;
    case 'sicak':
    case 'kahvalti':
    default:
      return <SteamBackground color={color} />;
  }
};

const Particles = ({ color }) => {
  const points = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 2 + (i * 3) % 5,
    x: 10 + (i * 17) % 78,
    dur: 6.5 + i * 1.15,
    delay: i * 0.75,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {points.map((point) => (
        <div
          key={point.id}
          className="ipek-particle"
          style={{
            position: 'absolute',
            width: point.size,
            height: point.size,
            borderRadius: '50%',
            background: color || 'rgba(197,160,89,0.7)',
            left: `${point.x}%`,
            bottom: '18%',
            boxShadow: `0 0 ${point.size * 4}px ${color || 'rgba(197,160,89,0.5)'}`,
            willChange: 'transform, opacity',
            animationDuration: `${point.dur}s`,
            animationDelay: `${point.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const timeToMinutes = (time) => {
  const [hour = 0, minute = 0] = String(time || '').split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
};

const isTimeInRange = (startTime, endTime) => {
  const start = timeToMinutes(startTime || '09:00');
  const end = timeToMinutes(endTime || '23:59');
  if (start === null || end === null) return true;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  if (start <= end) return current >= start && current <= end;
  return current >= start || current <= end;
};

const getActivePromoConfig = (promo) => {
  if (!promo?.enabled) return null;

  if (promo.scheduleEnabled) {
    const activeSlot = (promo.slots || []).find((slot) => (
      slot?.enabled !== false
      && isTimeInRange(slot.startTime, slot.endTime)
      && (slot.productId || slot.image || slot.title)
    ));

    if (activeSlot) {
      return {
        ...promo,
        ...activeSlot,
        title: activeSlot.title || promo.title,
        description: activeSlot.description || promo.description,
        image: activeSlot.image || promo.image,
        productId: activeSlot.productId || promo.productId,
        buttonLabel: activeSlot.buttonLabel || promo.buttonLabel,
      };
    }

    return isTimeInRange(promo.startTime, promo.endTime) ? promo : null;
  }

  return promo;
};

const normalizeText = (value) => String(value || '')
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const FILTER_ORDER = {
  sicak: ['Çay', 'Kahve', 'Sıcak'],
  soguk: ['İçecek', 'Soğuk Kahve', 'Milkshake / Frozen'],
  lezzetler: ['Döner', 'Köfte', 'Burger', 'Tost', 'Sandviç', 'Atıştırmalık', 'Lezzet'],
  pizzalar: ['Pizza'],
  kahvalti: ['Kahvaltı'],
  menuler: ['Menü'],
  tatlilar: ['Tatlı', 'Pasta', 'Cup', 'Waffle', 'Cedric'],
  kuruyemis: ['Kuruyemiş'],
  diger: ['Diğer'],
};

const getProductFilterLabel = (product, categoryId) => {
  if (product.filterLabel) return product.filterLabel;

  const haystack = normalizeText(`${product.name} ${product.tag || ''} ${product.aroma || ''} ${product.desc || ''}`);
  const tokens = haystack.split(/[^a-z0-9]+/).filter(Boolean);
  const hasToken = (...terms) => terms.some((term) => tokens.includes(term));
  const hasPhrase = (...terms) => terms.some((term) => haystack.includes(term));

  if (categoryId === 'tatlilar') {
    if (hasToken('cup')) return 'Cup';
    if (hasToken('waffle')) return 'Waffle';
    if (hasToken('cedric')) return 'Cedric';
    if (hasToken('cheesecake', 'trilece', 'sufle', 'brownie', 'mozaik', 'pasta') || hasPhrase('yas pasta')) return 'Pasta';
    return 'Tatlı';
  }

  if (categoryId === 'sicak') {
    if (hasToken('cay', 'oralet', 'french', 'salep')) return 'Çay';
    if (hasToken('kahve', 'espresso', 'latte', 'mocha', 'cappuccino', 'americano', 'nescafe', 'macchiato')) return 'Kahve';
    return 'Sıcak';
  }

  if (categoryId === 'soguk') {
    if (hasToken('ice', 'latte', 'kahve', 'frappe')) return 'Soğuk Kahve';
    if (hasToken('milkshake', 'frozen')) return 'Milkshake / Frozen';
    return 'İçecek';
  }

  if (categoryId === 'lezzetler') {
    if (hasToken('burger', 'hamburger', 'cheeseburger')) return 'Burger';
    if (hasToken('tost')) return 'Tost';
    if (hasToken('sandvic', 'patso', 'kumru', 'yengen')) return 'Sandviç';
    if (hasToken('doner')) return 'Döner';
    if (hasToken('kofte')) return 'Köfte';
    if (hasToken('atistirmalik', 'nugget', 'cips')) return 'Atıştırmalık';
    return 'Lezzet';
  }

  if (categoryId === 'kuruyemis') return 'Kuruyemiş';
  if (categoryId === 'pizzalar') return 'Pizza';
  if (categoryId === 'menuler') return 'Menü';

  if (hasToken('cay', 'oralet', 'french', 'salep')) return 'Çay';
  if (hasToken('kahve', 'espresso', 'latte', 'mocha', 'cappuccino', 'americano', 'nescafe')) return 'Kahve';
  if (hasToken('pizza')) return 'Pizza';
  if (hasToken('burger')) return 'Burger';
  if (hasToken('tost', 'sandvic', 'doner', 'kofte')) return 'Ana Ürün';
  if (hasToken('cup')) return 'Cup';
  if (hasToken('pasta', 'cheesecake', 'sufle', 'brownie', 'trilece')) return 'Pasta';
  if (hasToken('kuruyemis', 'fistik', 'badem', 'kaju', 'leblebi')) return 'Kuruyemiş';
  if (hasToken('cola', 'su', 'ayran', 'ice', 'limonata')) return 'İçecek';

  return product.tag || product.aroma || 'Menü';
};

const getCategoryFilters = (items, categoryId) => {
  const counts = new Map();
  items.forEach((product) => {
    const label = getProductFilterLabel(product, categoryId);
    if (!label) return;
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  const orderedLabels = FILTER_ORDER[categoryId] || [];
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      const aIndex = orderedLabels.indexOf(a.label);
      const bIndex = orderedLabels.indexOf(b.label);

      if (aIndex === -1 && bIndex === -1) return a.label.localeCompare(b.label, 'tr');
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
};

const getSearchableProductText = (product) => {
  const values = [
    product.name,
    product.desc,
    product.aroma,
    product.tag,
    product.filterLabel,
    ...(product.variants || []).map((variant) => variant.label),
  ];

  return normalizeText(values.join(' '));
};

const createSearchIndex = (categories) => categories.flatMap((category) => (
  category.items.map((product) => ({
    product,
    category,
    searchText: getSearchableProductText(product),
  }))
));

const getGlobalSearchResults = (searchIndex, searchQuery) => {
  if (!normalizeText(searchQuery).trim()) return [];

  const query = normalizeText(searchQuery).trim();
  return searchIndex.filter((row) => row.searchText.includes(query));
};

const CategoryFilterButton = ({ active, color, children, count, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[11px] font-black transition"
    style={{
      color: active ? '#FFFFFF' : 'rgba(42,36,33,0.62)',
      background: active ? color : 'rgba(255,255,255,0.78)',
      border: `1px solid ${active ? color : `${color}24`}`,
      boxShadow: active ? `0 10px 22px ${color}22` : '0 8px 18px rgba(42,36,33,0.04)',
    }}
  >
    <span>{children}</span>
    {typeof count === 'number' && (
      <span
        className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] leading-none"
        style={{
          color: active ? color : 'rgba(42,36,33,0.48)',
          background: active ? '#FFFFFF' : `${color}12`,
        }}
      >
        {count}
      </span>
    )}
  </button>
);

const MenuSearchBar = ({ value, onChange, onClear, bottomOffset }) => (
  <div
    key="menu-search"
    className="ipek-search-enter pointer-events-none fixed left-0 right-0 z-[68] px-4"
    style={{ bottom: bottomOffset }}
  >
    <div className="pointer-events-auto mx-auto flex h-12 max-w-[440px] items-center gap-2 rounded-full border border-black/5 bg-white/95 px-4 shadow-xl shadow-black/[0.07]">
      <SearchIcon size={17} className="shrink-0 text-[#C5A059]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ürün ara"
        className="min-w-0 flex-1 bg-transparent text-sm font-extrabold text-[#2A2421] outline-none placeholder:text-gray-400"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDFBF7] text-gray-400 transition hover:bg-black/5 hover:text-[#2A2421]"
          aria-label="Aramayı temizle"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  </div>
);

const SearchResultsPanel = ({ query, results, onOpenProduct }) => (
  <div
    key="search-results"
    className="ipek-modal-backdrop-enter fixed inset-0 z-[55] bg-[#FDFBF7]/96 px-4 pt-6"
  >
    <div className="mx-auto flex h-full max-w-[520px] flex-col pb-[154px] pt-6">
      <div className="mb-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C5A059]">
          Tüm menüde arama
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#2A2421]">
          {results.length} sonuç
        </h2>
        <p className="mt-1 truncate text-sm font-bold text-gray-400">
          “{query}”
        </p>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
        {results.length > 0 ? (
          results.map(({ product, category }, index) => (
            <ProductCard
              key={`${category.id}-${product.id}`}
              product={product}
              eyebrow={category.label}
              index={Math.min(index, 6)}
              onOpen={() => onOpenProduct(product, category)}
              accentColor={category.accentColor || '#C5A059'}
            />
          ))
        ) : (
          <div className="mt-12 rounded-[28px] border border-black/5 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-black text-[#2A2421]">Sonuç bulunamadı</p>
            <p className="mt-2 text-sm font-bold text-gray-400">Başka bir ürün adı deneyebilirsin.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const getInstagramLink = (value) => {
  const rawValue = String(value || '').trim();
  if (!rawValue) return null;

  if (/^https?:\/\//i.test(rawValue)) {
    const handle = rawValue
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/\/.*$/, '')
      .replace(/^@/, '');

    return {
      href: rawValue,
      label: handle ? `@${handle}` : 'Instagram',
    };
  }

  const handle = rawValue.replace(/^@/, '').replace(/\/.*$/, '');
  return {
    href: `https://instagram.com/${handle}`,
    label: `@${handle}`,
  };
};

const getWhatsAppLink = (value) => {
  const rawValue = String(value || '').trim();
  if (!rawValue) return null;

  if (/^https?:\/\//i.test(rawValue)) {
    return { href: rawValue, label: 'WhatsApp' };
  }

  const digits = rawValue.replace(/\D/g, '');
  if (!digits) return null;

  const normalized = digits.startsWith('0') ? `90${digits.slice(1)}` : digits;
  return {
    href: `https://wa.me/${normalized}`,
    label: 'WhatsApp',
  };
};

const HeroSocialLinks = ({ settings }) => {
  const instagram = getInstagramLink(settings?.instagram);
  const whatsapp = getWhatsAppLink(settings?.whatsapp);
  const instagramIcon = '/social-instagram.png';
  const whatsappIcon = '/social-whatsapp.png';
  if (!instagram && !whatsapp) return null;

  return (
    <div className="mt-6 grid w-full max-w-[360px] grid-cols-[3fr_2fr] gap-3">
      {instagram && (
        <a
          href={instagram.href}
          target="_blank"
          rel="noreferrer"
          className="ipek-social-pill inline-flex h-[54px] min-w-0 items-center justify-center gap-2 rounded-full border border-[#D8C08A]/40 bg-white/88 px-3 text-[0.78rem] font-black text-[#2A2421] shadow-[0_11px_24px_rgba(42,36,33,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-sm"
          aria-label={`Instagram ${instagram.label}`}
        >
          <img
            src={instagramIcon}
            alt=""
            className="h-8 w-8 shrink-0 rounded-xl object-contain"
            loading="eager"
            decoding="async"
          />
          <span className="min-w-0">{instagram.label}</span>
        </a>
      )}
      {whatsapp && (
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noreferrer"
          className="ipek-social-pill inline-flex h-[54px] min-w-0 items-center justify-center gap-2 rounded-full border border-[#D8C08A]/40 bg-white/88 px-3 text-[0.82rem] font-black text-[#2A2421] shadow-[0_11px_24px_rgba(42,36,33,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-sm"
          aria-label={whatsapp.label}
        >
          <img
            src={whatsappIcon}
            alt=""
            className="h-8 w-8 shrink-0 object-contain"
            loading="eager"
            decoding="async"
          />
          <span>WhatsApp</span>
        </a>
      )}
    </div>
  );
};

const CopyrightCredit = ({ compact = false, label = COPYRIGHT_LABEL }) => (
  <div
    className="ipek-copyright-credit"
    style={{
      bottom: compact
        ? 'calc(env(safe-area-inset-bottom, 0px) + 78px)'
        : 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
    }}
    aria-label="Mehmet Ali Erdoğan copyright"
  >
    <span>{label || COPYRIGHT_LABEL}</span>
  </div>
);

const formatBrandName = (value) => String(value || 'İPEK GOLD')
  .trim()
  .split(/\s+/)
  .join('\n');

const HeroSection = ({ contact, settings, onEnter }) => {
  const logo = settings?.logo || '/emblem.png';
  const title = formatBrandName(settings?.cafeName);
  const tagline = settings?.tagline || 'Cafe & Bistro';
  const phone = settings?.phone || contact?.phone;
  const address = settings?.address || contact?.address;
  const ctaLabel = settings?.heroCtaLabel || 'MENÜYÜ KEŞFET';
  const scrollLabel = settings?.heroScrollLabel || 'KAYDIR';

  return (
  <div className="snap-section flex flex-col items-center justify-center" style={{ height: '100dvh', position: 'relative' }}>
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 18%, #FFFFFF 0%, #FCFAF5 42%, #F4EFE5 100%)' }} />
    <CoffeeBackdrop opacity={0.2} />
    <SteamBackground color="#C5A059" />
    <Particles color="rgba(197,160,89,0.9)" />
    <div className="cinematic-overlay" />

    <div className="relative flex min-h-[760px] w-full max-w-[430px] flex-col items-center px-6 pb-[calc(env(safe-area-inset-bottom,0px)+74px)] pt-[calc(env(safe-area-inset-top,0px)+46px)] text-center max-[380px]:min-h-0 max-[380px]:pb-10 max-[380px]:pt-6" style={{ zIndex: 10 }}>
      <div className="ipek-soft-enter flex flex-1 flex-col items-center justify-center gap-1">
        <img
          src={logo}
          width="512"
          height="601"
          decoding="async"
          className="ipek-logo-enter"
          alt={`${settings?.cafeName || 'İpek Gold'} Logo`}
          style={{
            width: 'clamp(86px, 24vw, 128px)',
            height: 'auto',
            marginBottom: 42,
            transformOrigin: 'center',
            backfaceVisibility: 'hidden',
            filter: 'drop-shadow(0 12px 22px rgba(197,160,89,0.18))',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10 }}>
          <div style={{ width: 58, height: 1, background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.55))' }} />
          <span style={{ fontSize: '0.82rem', color: '#C5A059', letterSpacing: '0.32em', textTransform: 'uppercase', fontWeight: 900, whiteSpace: 'nowrap' }}>
            {tagline}
          </span>
          <div style={{ width: 58, height: 1, background: 'linear-gradient(90deg, rgba(197,160,89,0.55), transparent)' }} />
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(4.75rem, 20.5vw, 7.2rem)',
            fontWeight: 800,
            color: '#2A2421',
            letterSpacing: '-0.035em',
            lineHeight: 0.86,
            whiteSpace: 'pre-line',
          }}
        >
          {title}
        </h1>

        <p style={{ marginTop: 20, fontSize: 'clamp(0.86rem, 3vw, 1rem)', color: 'rgba(42,36,33,0.52)', letterSpacing: '0.36em', textTransform: 'uppercase', lineHeight: 1.7, fontWeight: 800 }}>
          QR MENÜ
        </p>
        {(phone || address) && (
          <div style={{ marginTop: 14, fontSize: 'clamp(1rem, 3.7vw, 1.18rem)', color: 'rgba(42,36,33,0.62)', fontWeight: 900, lineHeight: 1.48, maxWidth: 360, wordBreak: 'break-word' }}>
            {phone && <p>{phone}</p>}
            {address && <p>{address}</p>}
          </div>
        )}
        <HeroSocialLinks settings={settings} />

        <button
          onClick={onEnter}
          className="ipek-pressable ipek-page-enter pulse-gold mt-10 h-[64px] w-full max-w-[286px] rounded-full border-0 text-white shadow-[0_18px_34px_rgba(197,160,89,0.30)]"
          style={{
            background: 'linear-gradient(135deg, #C5A059 0%, #D8B96C 100%)',
            fontWeight: 900,
            fontSize: 'clamp(0.96rem, 3.7vw, 1.12rem)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            willChange: 'transform',
            animationDelay: '0.28s',
          }}
        >
          {ctaLabel}
        </button>

        <div
          className="ipek-page-enter mt-9 flex flex-col items-center gap-3"
          style={{ animationDelay: '0.44s' }}
        >
          <span style={{ fontSize: '0.82rem', color: 'rgba(42,36,33,0.56)', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 900 }}>{scrollLabel}</span>
          <span
            className="ipek-scroll-cue"
            style={{ color: 'rgba(42,36,33,0.42)', fontSize: 28, lineHeight: 1 }}
          >
            ↓
          </span>
        </div>
      </div>
    </div>
    <CopyrightCredit label={settings?.copyright} />
  </div>
  );
};

const CategorySection = ({
  category,
  onOpenProduct,
  onSearchBarVisibilityChange,
  entryLocked = false,
}) => {
  const { label, emoji, tagline, items, accentColor } = category;
  const accent = accentColor || '#C5A059';
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const productScrollRef = useRef(null);
  const lastProductScrollTopRef = useRef(0);
  const filters = getCategoryFilters(items, category.id);
  const visibleRows = items.filter((product) => (
    activeFilter === 'all' || getProductFilterLabel(product, category.id) === activeFilter
  )).map((product) => (
    { product, category }
  ));
  const hasActiveFilter = activeFilter !== 'all';

  useEffect(() => {
    lastProductScrollTopRef.current = 0;
    productScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [category.id]);

  const handleProductScroll = useCallback((event) => {
    const scrollTop = event.currentTarget.scrollTop;
    const shouldCompact = scrollTop > 28;
    const scrollDelta = scrollTop - lastProductScrollTopRef.current;

    if (Math.abs(scrollDelta) > 10) {
      onSearchBarVisibilityChange(scrollDelta < 0 || scrollTop < 36);
      lastProductScrollTopRef.current = scrollTop;
    }

    setIsHeaderCompact((current) => (current === shouldCompact ? current : shouldCompact));
  }, [onSearchBarVisibilityChange]);

  return (
    <div className="snap-section flex flex-col" style={{ position: 'relative', background: '#FDFBF7' }}>
      <CategoryBackground category={category} color={accent} />
      <div className="absolute inset-0" style={{ zIndex: 3, background: 'linear-gradient(180deg, rgba(253,251,247,0.94) 0%, rgba(253,251,247,0.78) 34%, rgba(253,251,247,0.96) 100%)' }} />

      <div className="relative flex h-full flex-col" style={{ zIndex: 10 }}>
        <div
          className="flex flex-shrink-0 flex-col items-center px-6 text-center"
          style={{
            paddingTop: isHeaderCompact ? 18 : 56,
            paddingBottom: isHeaderCompact ? 10 : 20,
            background: isHeaderCompact ? 'rgba(253,251,247,0.88)' : 'rgba(253,251,247,0)',
            borderBottom: isHeaderCompact ? `1px solid ${accent}1F` : '1px solid rgba(0,0,0,0)',
            boxShadow: isHeaderCompact ? '0 10px 28px rgba(42,36,33,0.05)' : 'none',
            transition: 'padding 0.28s cubic-bezier(0.22, 1, 0.36, 1), background 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
          }}
        >
          <div className="ipek-page-enter flex flex-col items-center">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isHeaderCompact ? 6 : 8,
                marginBottom: isHeaderCompact ? 4 : 10,
                transition: 'gap 0.28s ease, margin 0.28s ease',
              }}
            >
              <div style={{ width: isHeaderCompact ? 18 : 24, height: 1, background: accent, transition: 'width 0.28s ease' }} />
              <span
                style={{
                  fontSize: isHeaderCompact ? '1.05rem' : '1.4rem',
                  filter: `drop-shadow(0 4px 8px ${accent}44)`,
                  transition: 'font-size 0.28s ease',
                }}
              >
                {emoji}
              </span>
              <div style={{ width: isHeaderCompact ? 18 : 24, height: 1, background: accent, transition: 'width 0.28s ease' }} />
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isHeaderCompact ? 'clamp(1.55rem, 6vw, 2.1rem)' : 'clamp(2.35rem, 9.5vw, 4rem)',
                fontWeight: 800,
                color: '#2A2421',
                lineHeight: 1,
                letterSpacing: 0,
                transition: 'font-size 0.28s ease',
              }}
            >
              {label}
            </h2>
            <p
              style={{
                fontSize: 'clamp(0.64rem, 2vw, 0.78rem)',
                color: 'rgba(42,36,33,0.72)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: isHeaderCompact ? 0 : 12,
                lineHeight: 1.6,
                maxWidth: 360,
                maxHeight: isHeaderCompact ? 0 : 48,
                opacity: isHeaderCompact ? 0 : 1,
                overflow: 'hidden',
                fontWeight: 600,
                transition: 'opacity 0.2s ease, max-height 0.28s ease, margin 0.28s ease',
              }}
            >
              {tagline}
            </p>
            <span
              className="mt-3 rounded-full px-3 py-1"
              style={{
                color: accent,
                background: `${accent}12`,
                border: `1px solid ${accent}22`,
                fontSize: isHeaderCompact ? '0.58rem' : '0.68rem',
                fontWeight: 800,
                marginTop: isHeaderCompact ? 4 : 12,
                padding: isHeaderCompact ? '2px 10px' : '4px 12px',
                transition: 'font-size 0.28s ease, margin 0.28s ease, padding 0.28s ease',
              }}
            >
              {hasActiveFilter ? `${visibleRows.length} sonuç` : `${items.length} ürün`}
            </span>
          </div>
        </div>

        <div
          ref={productScrollRef}
          className="custom-scrollbar"
          onScroll={handleProductScroll}
          style={{
            flex: 1,
            overflowY: entryLocked ? 'hidden' : 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: entryLocked ? 'none' : 'pan-y',
            pointerEvents: entryLocked ? 'none' : 'auto',
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 140,
          }}
        >
          {filters.length > 1 && (
            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto px-1 pt-1">
              <CategoryFilterButton
                active={activeFilter === 'all'}
                color={accent}
                onClick={() => setActiveFilter('all')}
              >
                Hepsi
              </CategoryFilterButton>
              {filters.map((filter) => (
                <CategoryFilterButton
                  key={filter.label}
                  active={activeFilter === filter.label}
                  count={filter.count}
                  color={accent}
                  onClick={() => setActiveFilter(filter.label)}
                >
                  {filter.label}
                </CategoryFilterButton>
              ))}
            </div>
          )}
          {visibleRows.length > 0 ? (
            visibleRows.map(({ product, category: productCategory }, index) => (
              <ProductCard
                key={`${productCategory.id}-${product.id}`}
                product={product}
                index={index}
                onOpen={() => onOpenProduct(product, productCategory)}
                accentColor={productCategory.accentColor || accent}
              />
            ))
          ) : (
            <div
              className="mt-10 rounded-[24px] border bg-white/82 px-5 py-7 text-center shadow-sm"
              style={{ borderColor: `${accent}20` }}
            >
              <p className="text-sm font-black text-[#2A2421]">Sonuç bulunamadı</p>
              <p className="mt-2 text-xs font-bold text-gray-400">Aramayı veya filtreyi değiştir.</p>
            </div>
          )}
          <div style={{ height: 20 }} />
        </div>
      </div>
    </div>
  );
};

const MenuLayout = () => {
  const { menu, settings } = useMenuStore();
  const [activeCategory, setActiveCategory] = useState('hero');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPromo, setShowPromo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const [isMenuEntryLocked, setIsMenuEntryLocked] = useState(false);

  const heroTouchStartYRef = useRef(null);
  const promoShownRef = useRef(false);
  const promoTimerRef = useRef(null);
  const menuEntryTimerRef = useRef(null);

  const categories = menu.categories;
  const currentCategory = useMemo(() => (
    categories.find((category) => category.id === activeCategory) || categories[0]
  ), [activeCategory, categories]);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const searchIndex = useMemo(() => createSearchIndex(categories), [categories]);
  const globalSearchResults = useMemo(
    () => getGlobalSearchResults(searchIndex, deferredSearchQuery),
    [deferredSearchQuery, searchIndex],
  );
  const isSearchOpen = Boolean(searchQuery.trim());
  const promo = settings.promo || {};
  const activePromo = getActivePromoConfig(promo);
  let promoTarget = null;
  if (activePromo?.productId) {
    for (const category of categories) {
      const product = category.items.find((item) => (
        item.id === activePromo.productId && item.isAvailable !== false
      ));
      if (product) {
        promoTarget = { product, category };
        break;
      }
    }
  }
  const canShowPromo = Boolean(activePromo);

  const requestPromo = useCallback((delay = 300) => {
    if (!canShowPromo || promoShownRef.current) return;
    promoShownRef.current = true;
    if (promoTimerRef.current) window.clearTimeout(promoTimerRef.current);
    promoTimerRef.current = window.setTimeout(() => {
      promoTimerRef.current = null;
      if (document.querySelector('[data-ipek-promo="open"]')) return;
      setShowPromo(true);
    }, delay);
  }, [canShowPromo]);

  const handleSearchBarVisibilityChange = useCallback((visible) => {
    setIsSearchBarVisible((current) => (current === visible ? current : visible));
  }, []);

  const handleNavTap = useCallback((categoryId) => {
    if (menuEntryTimerRef.current) window.clearTimeout(menuEntryTimerRef.current);

    setActiveCategory(categoryId);
    setSearchQuery('');
    setIsSearchBarVisible(true);
    setIsMenuEntryLocked(true);

    menuEntryTimerRef.current = window.setTimeout(() => {
      setIsMenuEntryLocked(false);
      menuEntryTimerRef.current = null;
    }, 650);
  }, []);

  const handleHeroEnter = useCallback(() => {
    if (categories[0]) handleNavTap(categories[0].id);
    requestPromo(320);
  }, [categories, handleNavTap, requestPromo]);

  const handlePromoShortcut = useCallback(() => {
    setShowPromo(false);
    if (!promoTarget) return;

    handleNavTap(promoTarget.category.id);
    window.setTimeout(() => {
      setSelectedProduct(promoTarget.product);
      setSelectedCategory(promoTarget.category);
    }, 420);
  }, [handleNavTap, promoTarget]);

  useEffect(() => () => {
    if (promoTimerRef.current) window.clearTimeout(promoTimerRef.current);
    if (menuEntryTimerRef.current) window.clearTimeout(menuEntryTimerRef.current);
  }, []);

  useEffect(() => {
    if (activeCategory === 'hero' || !currentCategory?.items?.length) return undefined;

    const preloaders = currentCategory.items
      .slice(0, 12)
      .map((product) => product.image)
      .filter(Boolean)
      .map((src) => {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        return image;
      });

    return () => {
      preloaders.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [activeCategory, currentCategory]);

  const handleHeroWheel = useCallback((event) => {
    if (event.deltaY > 24) {
      event.preventDefault();
      handleHeroEnter();
    }
  }, [handleHeroEnter]);

  const handleHeroTouchStart = useCallback((event) => {
    heroTouchStartYRef.current = event.touches?.[0]?.clientY ?? null;
  }, []);

  const handleHeroTouchEnd = useCallback((event) => {
    const startY = heroTouchStartYRef.current;
    const endY = event.changedTouches?.[0]?.clientY;
    heroTouchStartYRef.current = null;

    if (typeof startY === 'number' && typeof endY === 'number' && startY - endY > 46) {
      handleHeroEnter();
    }
  }, [handleHeroEnter]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#FDFBF7', overflow: 'hidden' }}>
      <div
        style={{
          height: '100dvh',
          overflow: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none',
        }}
      >
        {activeCategory === 'hero' ? (
          <div
            key="hero"
            className="ipek-page-enter h-full"
            onWheel={handleHeroWheel}
            onTouchStart={handleHeroTouchStart}
            onTouchEnd={handleHeroTouchEnd}
          >
            <HeroSection contact={menu.contact} settings={settings} onEnter={handleHeroEnter} />
          </div>
        ) : currentCategory ? (
          <div
            key={currentCategory.id}
            className="ipek-page-enter h-full"
          >
            <CategorySection
              category={currentCategory}
              entryLocked={isMenuEntryLocked}
              onSearchBarVisibilityChange={handleSearchBarVisibilityChange}
              onOpenProduct={(product, productCategory = currentCategory) => {
                setSelectedProduct(product);
                setSelectedCategory(productCategory);
              }}
            />
          </div>
        ) : null}
      </div>

      {activeCategory !== 'hero' && isSearchOpen && (
        <SearchResultsPanel
          query={searchQuery}
          results={globalSearchResults}
          onOpenProduct={(product, productCategory) => {
            setSelectedProduct(product);
            setSelectedCategory(productCategory);
          }}
        />
      )}

      {activeCategory !== 'hero' && (isSearchBarVisible || isSearchOpen) && (
        <MenuSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          bottomOffset={92}
        />
      )}

      {activeCategory !== 'hero' && (
        <BottomNav activeCategory={activeCategory} onSelect={handleNavTap} />
      )}

      {activeCategory !== 'hero' && <CopyrightCredit compact />}

      {showPromo && canShowPromo && !isSearchOpen && (
        <PromoModal
          promo={activePromo}
          product={promoTarget?.product}
          category={promoTarget?.category}
          onClose={() => setShowPromo(false)}
          onGoToProduct={handlePromoShortcut}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          category={selectedCategory}
          onClose={() => {
            setSelectedProduct(null);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default MenuLayout;
