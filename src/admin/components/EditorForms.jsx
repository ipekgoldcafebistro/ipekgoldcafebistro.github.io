import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CircleCheck,
  Image as ImageIcon,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import ProductImage from '../../components/ProductImage';
import { optimizeImageFile } from '../../utils/imageTools';

const emptyVariant = { label: '', price: '' };

const preventNumberWheel = (event) => {
  event.currentTarget.blur();
};

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

const filterLabelSuggestions = {
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

export const CategoryEditor = ({ menu, saveCategory }) => {
  const { catId } = useParams();
  const navigate = useNavigate();
  const existing = menu?.categories.find((category) => category.id === catId);
  const [formData, setFormData] = useState(() => existing || {
    label: '',
    emoji: '☕',
    accentColor: '#C5A059',
    tagline: '',
    bgImage: '/hero_cup.png',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    saveCategory(formData);
    navigate('/admin/categories');
  };

  return (
    <EditorShell
      eyebrow="Kategori"
      title={existing ? 'Kategori Düzenle' : 'Kategori Ekle'}
      backTo="/admin/categories"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_140px]">
          <InputGroup label="Kategori adı">
            <input
              type="text"
              value={formData.label}
              onChange={(event) => setFormData({ ...formData, label: event.target.value })}
              className="studio-input"
              required
            />
          </InputGroup>

          <InputGroup label="Simge">
            <input
              type="text"
              value={formData.emoji}
              onChange={(event) => setFormData({ ...formData, emoji: event.target.value })}
              className="studio-input text-center text-2xl"
            />
          </InputGroup>
        </div>

        <InputGroup label="Kategori açıklaması">
          <input
            type="text"
            value={formData.tagline}
            onChange={(event) => setFormData({ ...formData, tagline: event.target.value })}
            className="studio-input"
          />
        </InputGroup>

        <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
          <InputGroup label="Tema rengi">
            <div className="flex items-center gap-3 rounded-[24px] border border-black/5 bg-[#FDFBF7] p-3">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(event) => setFormData({ ...formData, accentColor: event.target.value })}
                className="h-12 w-14 cursor-pointer rounded-2xl border-none bg-transparent"
              />
              <span className="font-mono text-[11px] font-bold text-gray-500">{formData.accentColor}</span>
            </div>
          </InputGroup>

          <InputGroup label="Arka plan görsel yolu">
            <input
              type="text"
              value={formData.bgImage || ''}
              onChange={(event) => setFormData({ ...formData, bgImage: event.target.value })}
              className="studio-input"
            />
          </InputGroup>
        </div>

        <SubmitButton label="Kategoriyi Kaydet" />
      </form>
    </EditorShell>
  );
};

export const ProductEditor = ({ menu, saveProduct }) => {
  const { catId, prodId } = useParams();
  const navigate = useNavigate();
  const existingCategory = menu.categories.find((category) => category.id === catId);
  const existingProduct = existingCategory?.items.find((item) => item.id === prodId);
  const [variants, setVariants] = useState(() => existingProduct?.variants?.length
    ? existingProduct.variants.map((variant) => ({ label: variant.label, price: String(variant.price) }))
    : []);
  const [formData, setFormData] = useState(() => {
    if (existingProduct) {
      return {
        ...existingProduct,
        price: String(existingProduct.price ?? ''),
        category: catId,
        tag: existingProduct.tag || '',
        aroma: existingProduct.aroma || '',
        desc: existingProduct.desc || '',
        filterLabel: existingProduct.filterLabel || '',
      };
    }

    return {
      name: '',
      price: '',
      desc: '',
      category: catId || menu.categories[0]?.id || '',
      image: '',
      imageZoom: 1,
      imageX: 0,
      imageY: 0,
      aroma: '',
      tag: '',
      filterLabel: '',
      isNew: false,
      isAvailable: true,
    };
  });

  const activeCategory = useMemo(
    () => menu.categories.find((category) => category.id === formData.category) || menu.categories[0],
    [formData.category, menu.categories],
  );

  const previewImage = formData.image || activeCategory?.bgImage || '/hero_cup.png';
  const previewProduct = { ...formData, image: previewImage };
  const activeFilterSuggestions = filterLabelSuggestions[formData.category] || [];

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    optimizeImageFile(file).then((image) => {
      if (!image) return;
      setFormData((current) => ({ ...current, image }));
    });
  };

  const updateImagePosition = (updates) => {
    setFormData((current) => ({ ...current, ...updates }));
  };

  const adjustImageZoom = (delta) => {
    setFormData((current) => ({
      ...current,
      imageZoom: Number(clampValue(Number(current.imageZoom ?? 1) + delta, 0.65, 2.2).toFixed(2)),
    }));
  };

  const handleVariantChange = (index, key, value) => {
    setVariants((current) => current.map((variant, variantIndex) => (
      variantIndex === index ? { ...variant, [key]: value } : variant
    )));
  };

  const addVariant = () => setVariants((current) => [...current, { ...emptyVariant }]);

  const removeVariant = (index) => {
    setVariants((current) => current.filter((_, variantIndex) => variantIndex !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveProduct(formData.category, { ...formData, variants }, catId);
    navigate('/admin/products');
  };

  if (prodId && !existingProduct) {
    return (
      <EditorShell eyebrow="Ürün" title="Ürün Bulunamadı" backTo="/admin/products">
        <Link to="/admin/products" className="inline-flex items-center gap-2 rounded-full bg-[#2A2421] px-5 py-3 text-sm font-black text-white">
          <ArrowLeft size={17} />
          Ürünlere dön
        </Link>
      </EditorShell>
    );
  }

  return (
    <EditorShell
      eyebrow="Ürün"
      title={existingProduct ? 'Ürün Düzenle' : 'Ürün Ekle'}
      backTo="/admin/products"
    >
      <form onSubmit={handleSubmit} className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <InputGroup label="Ürün adı">
            <input
              type="text"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="studio-input"
              required
            />
          </InputGroup>

          <div className="grid gap-5 lg:grid-cols-2">
            <InputGroup label="Kategori">
              <select
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                className="studio-input"
              >
                {menu.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </InputGroup>

            <InputGroup label="Tek fiyat">
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={formData.price}
                onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                onWheel={preventNumberWheel}
                className="studio-input"
                disabled={variants.length > 0}
                required={variants.length === 0}
              />
            </InputGroup>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <InputGroup label="Üst etiket">
              <input
                type="text"
                value={formData.tag}
                onChange={(event) => setFormData({ ...formData, tag: event.target.value })}
                className="studio-input"
              />
            </InputGroup>

            <InputGroup label="Kısa açıklama">
              <input
                type="text"
                value={formData.aroma}
                onChange={(event) => setFormData({ ...formData, aroma: event.target.value })}
                className="studio-input"
              />
            </InputGroup>
          </div>

          <InputGroup label="Detay açıklaması">
            <textarea
              value={formData.desc}
              onChange={(event) => setFormData({ ...formData, desc: event.target.value })}
              className="studio-input min-h-32 resize-none"
            />
          </InputGroup>

          <InputGroup label="Menü filtresi">
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                list="product-filter-suggestions"
                value={formData.filterLabel || ''}
                onChange={(event) => setFormData({ ...formData, filterLabel: event.target.value })}
                className="studio-input"
                placeholder="Boş kalırsa otomatik belirlenir"
              />
              {formData.filterLabel && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, filterLabel: '' })}
                  className="rounded-full bg-[#FDFBF7] px-5 py-3 text-xs font-black text-gray-500 transition hover:bg-black/5 hover:text-[#2A2421]"
                >
                  Otomatik
                </button>
              )}
            </div>
            <datalist id="product-filter-suggestions">
              {activeFilterSuggestions.map((label) => (
                <option key={label} value={label} />
              ))}
            </datalist>
            <p className="px-1 text-xs font-bold text-gray-400">
              Örn. Kovada Waffle için Waffle, cup ürünleri için Cup.
            </p>
          </InputGroup>

          <section className="rounded-[28px] border border-black/5 bg-[#FDFBF7] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-500">Fiyat seçenekleri</h3>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#2A2421] shadow-sm transition hover:bg-gold hover:text-white"
              >
                <Plus size={15} />
                Ekle
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-gray-500">
                Seçenek yoksa tek fiyat alanı kullanılır.
              </p>
            ) : (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-[1fr_110px_44px] gap-2">
                    <input
                      type="text"
                      value={variant.label}
                      onChange={(event) => handleVariantChange(index, 'label', event.target.value)}
                      className="studio-input !rounded-2xl !px-4 !py-3"
                      placeholder="Seçenek"
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={variant.price}
                      onChange={(event) => handleVariantChange(index, 'price', event.target.value)}
                      onWheel={preventNumberWheel}
                      className="studio-input !rounded-2xl !px-4 !py-3"
                      placeholder="TL"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="flex items-center justify-center rounded-2xl bg-white text-gray-400 transition hover:bg-red-500 hover:text-white"
                      aria-label="Seçeneği sil"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-black/5 bg-white p-4 shadow-xl shadow-black/[0.03]">
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#FDFBF7]">
              <div className="h-full w-full p-4">
                <ProductImage product={previewProduct} alt="" className="h-full w-full" />
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A2421] px-4 py-3 text-sm font-black text-white transition hover:bg-gold">
              <Upload size={17} />
              Görsel Yükle
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <InputGroup label="Görsel yolu">
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
              <input
                type="text"
                value={formData.image || ''}
                onChange={(event) => setFormData({ ...formData, image: event.target.value })}
                className="studio-input pl-12"
              />
            </div>
          </InputGroup>

          <section className="rounded-[24px] border border-black/5 bg-[#FDFBF7] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Görsel konumu</h3>
                <p className="mt-1 text-xs font-bold text-gray-500">Fotoğrafı kart içinde admin’den düzelt.</p>
              </div>
              <button
                type="button"
                onClick={() => updateImagePosition({ imageZoom: 1, imageX: 0, imageY: 0 })}
                className="rounded-full bg-white px-3 py-2 text-[10px] font-black text-gray-500 transition hover:bg-black/5 hover:text-[#2A2421]"
              >
                Sıfırla
              </button>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => adjustImageZoom(-0.08)}
                className="rounded-2xl bg-white px-3 py-3 text-[10px] font-black text-gray-500 transition hover:bg-black/5 hover:text-[#2A2421]"
              >
                Uzaklaştır
              </button>
              <button
                type="button"
                onClick={() => updateImagePosition({ imageX: 0, imageY: 0 })}
                className="rounded-2xl bg-white px-3 py-3 text-[10px] font-black text-[#B88A2E] transition hover:bg-[#C5A059] hover:text-white"
              >
                Ortala
              </button>
              <button
                type="button"
                onClick={() => adjustImageZoom(0.08)}
                className="rounded-2xl bg-white px-3 py-3 text-[10px] font-black text-gray-500 transition hover:bg-black/5 hover:text-[#2A2421]"
              >
                Yakınlaştır
              </button>
            </div>

            <div className="space-y-4">
              <RangeControl
                label="Yakınlaştır"
                value={Number(formData.imageZoom ?? 1)}
                min={0.65}
                max={2.2}
                step={0.01}
                display={`${Math.round(Number(formData.imageZoom ?? 1) * 100)}%`}
                onChange={(value) => updateImagePosition({ imageZoom: value })}
              />
              <RangeControl
                label="Yatay"
                value={Number(formData.imageX ?? 0)}
                min={-70}
                max={70}
                step={1}
                display={`${Number(formData.imageX ?? 0)}%`}
                onChange={(value) => updateImagePosition({ imageX: value })}
              />
              <RangeControl
                label="Dikey"
                value={Number(formData.imageY ?? 0)}
                min={-70}
                max={70}
                step={1}
                display={`${Number(formData.imageY ?? 0)}%`}
                onChange={(value) => updateImagePosition({ imageY: value })}
              />
            </div>
          </section>

          <Toggle
            label="Yeni"
            icon={Sparkles}
            checked={formData.isNew}
            onChange={(value) => setFormData({ ...formData, isNew: value })}
          />

          <Toggle
            label="Stokta"
            icon={CircleCheck}
            checked={formData.isAvailable !== false}
            onChange={(value) => setFormData({ ...formData, isAvailable: value })}
          />

          <SubmitButton label={existingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'} />
        </aside>
      </form>
    </EditorShell>
  );
};

const EditorShell = ({ eyebrow, title, backTo, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    className="mx-auto max-w-5xl space-y-4 lg:space-y-6"
  >
    <div className="flex flex-col gap-4 rounded-[26px] bg-[#2A2421] p-5 text-white sm:flex-row sm:items-center sm:justify-between lg:p-7">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#E3B84E]">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-black leading-tight lg:text-3xl">{title}</h1>
      </div>
      <Link to={backTo} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white hover:text-[#2A2421]">
        <ArrowLeft size={17} />
        Geri
      </Link>
    </div>

    <div className="rounded-[24px] border border-black/5 bg-white p-4 shadow-sm lg:rounded-[32px] lg:p-7">
      {children}
    </div>
  </motion.div>
);

const InputGroup = ({ label, children }) => (
  <label className="block space-y-2">
    <span className="block px-1 text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">
      {label}
    </span>
    {children}
  </label>
);

const Toggle = ({ label, icon: Icon, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex h-14 items-center justify-center gap-2 rounded-2xl border text-xs font-black transition ${
      checked
        ? 'border-gold bg-gold text-white'
        : 'border-black/5 bg-white text-gray-400 hover:bg-black/5 hover:text-[#2A2421]'
    }`}
  >
    <Icon size={17} />
    {label}
  </button>
);

const RangeControl = ({ label, value, min, max, step, display, onChange }) => (
  <label className="block">
    <span className="mb-2 flex items-center justify-between gap-3 text-[11px] font-black text-gray-500">
      <span>{label}</span>
      <span className="rounded-full bg-white px-2 py-1 text-[10px] text-[#B88A2E]">{display}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full accent-[#C5A059]"
    />
  </label>
);

const SubmitButton = ({ label }) => (
  <button type="submit" className="studio-submit-btn inline-flex items-center justify-center gap-3">
    <Save size={18} />
    {label}
  </button>
);
