import React, { useDeferredValue, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import ProductImage from '../../components/ProductImage';

const getPriceLabel = (product) => {
  if (product.variants?.length) {
    const prices = product.variants.map((variant) => Number(variant.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min} TL` : `${min} TL'den`;
  }

  return `${product.price || 0} TL`;
};

const normalizeText = (value) => String(value || '')
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const ProductManager = ({ menu, deleteProduct, moveProduct }) => {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const deferredSearch = useDeferredValue(search);

  const products = useMemo(() => {
    const allProducts = menu.categories.flatMap((category) => (
      category.items.map((item, index) => ({
        ...item,
        categoryId: category.id,
        categoryLabel: category.label,
        categoryColor: category.accentColor || '#C5A059',
        productIndex: index,
        categorySize: category.items.length,
        searchText: normalizeText([
          item.name,
          item.desc,
          item.aroma,
          item.tag,
          item.filterLabel,
          ...(item.variants || []).map((variant) => variant.label),
        ].join(' ')),
      }))
    ));

    return allProducts.filter((product) => {
      const matchesCategory = activeCat === 'all' || product.categoryId === activeCat;
      const query = normalizeText(deferredSearch).trim();
      const matchesSearch = !query || product.searchText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCat, deferredSearch, menu.categories]);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 lg:space-y-6">
      <header className="flex flex-col gap-4 rounded-[26px] bg-[#2A2421] p-5 text-white lg:flex-row lg:items-center lg:justify-between lg:p-7">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#E3B84E]">Ürünler</p>
          <h1 className="mt-1 text-2xl font-black leading-tight lg:text-3xl">Menü Ürünleri</h1>
          <p className="mt-1 text-sm font-bold text-white/50">{products.length} ürün</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#2A2421] transition hover:bg-[#E3B84E]"
        >
          <Plus size={18} />
          Ürün Ekle
        </Link>
      </header>

      <div className="grid gap-3 rounded-[24px] border border-black/5 bg-white p-3 shadow-sm lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="studio-input pl-12"
            placeholder="Ürün ara"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <FilterButton active={activeCat === 'all'} onClick={() => setActiveCat('all')}>Hepsi</FilterButton>
          {menu.categories.map((category) => (
            <FilterButton
              key={category.id}
              active={activeCat === category.id}
              onClick={() => setActiveCat(category.id)}
            >
              {category.label}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            deleteProduct={deleteProduct}
            moveProduct={moveProduct}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="rounded-[28px] border border-black/5 bg-white px-6 py-14 text-center font-bold text-gray-400">
          Ürün bulunamadı.
        </div>
      )}
    </motion.div>
  );
};

const FilterButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-12 shrink-0 rounded-full px-5 text-xs font-black transition ${
      active ? 'bg-[#2A2421] text-white' : 'bg-[#FDFBF7] text-gray-500 hover:bg-black/5 hover:text-[#2A2421]'
    }`}
  >
    {children}
  </button>
);

const ProductRow = ({ product, deleteProduct, moveProduct }) => {
  const isAvailable = product.isAvailable !== false;
  const canMoveUp = product.productIndex > 0;
  const canMoveDown = product.productIndex < product.categorySize - 1;

  return (
  <div className={`grid grid-cols-[70px_1fr_auto] items-center gap-3 rounded-[22px] border border-black/5 bg-white p-3 shadow-sm transition hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.04] lg:grid-cols-[78px_1fr_auto] lg:gap-4 ${isAvailable ? '' : 'opacity-70'}`}>
    <div className="relative h-[70px] overflow-hidden rounded-[18px] bg-[#FDFBF7] lg:h-[78px] lg:rounded-[22px]">
      <div className="h-full w-full p-2">
        <ProductImage product={product} alt={product.name} className={`h-full w-full ${isAvailable ? '' : 'grayscale opacity-60'}`} />
      </div>
      {product.isNew && (
        <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: product.categoryColor }} />
      )}
    </div>

    <div className="min-w-0">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className="rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: product.categoryColor, background: `${product.categoryColor}12` }}>
          {product.categoryLabel}
        </span>
        {product.variants?.length > 0 && (
          <span className="rounded-full bg-black/5 px-2 py-1 text-[9px] font-black text-gray-400">
            {product.variants.length} seçenek
          </span>
        )}
        {!isAvailable && (
          <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-red-500">
            Kapalı
          </span>
        )}
      </div>
      <h2 className="truncate text-base font-black text-[#2A2421] lg:text-lg">{product.name}</h2>
      <p className="mt-1 line-clamp-1 text-sm font-medium text-gray-500">{product.desc || product.aroma || 'Açıklama yok'}</p>
      <p className="mt-1 text-base font-black lg:text-lg" style={{ color: isAvailable ? product.categoryColor : '#EF4444' }}>
        {isAvailable ? getPriceLabel(product) : 'Bugün yok'}
      </p>
    </div>

    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => moveProduct(product.categoryId, product.id, 'up')}
          disabled={!canMoveUp}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 text-gray-500 transition hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/5 disabled:hover:text-gray-500"
          aria-label="Ürünü yukarı taşı"
          title="Yukarı taşı"
        >
          <ArrowUp size={15} />
        </button>
        <button
          type="button"
          onClick={() => moveProduct(product.categoryId, product.id, 'down')}
          disabled={!canMoveDown}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 text-gray-500 transition hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/5 disabled:hover:text-gray-500"
          aria-label="Ürünü aşağı taşı"
          title="Aşağı taşı"
        >
          <ArrowDown size={15} />
        </button>
      </div>
      <Link
        to={`/admin/products/edit/${product.categoryId}/${product.id}`}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-gray-500 transition hover:bg-gold hover:text-white"
        aria-label="Ürünü düzenle"
      >
        <Pencil size={17} />
      </Link>
      <button
        type="button"
        onClick={() => window.confirm('Bu ürünü silmek istiyor musunuz?') && deleteProduct(product.categoryId, product.id)}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-gray-500 transition hover:bg-red-500 hover:text-white"
        aria-label="Ürünü sil"
      >
        <Trash2 size={17} />
      </button>
    </div>
  </div>
  );
};

export default ProductManager;
