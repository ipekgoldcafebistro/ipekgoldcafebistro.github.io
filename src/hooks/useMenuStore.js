import { useEffect, useRef, useState } from 'react';
import { menuData as initialData } from '../data/menuData';
import { COPYRIGHT_LABEL } from '../constants/branding';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

const ROW_ID = 'current';

const clone = (value) => JSON.parse(JSON.stringify(value));

const isValidMenu = (menu) => (
  menu
  && Array.isArray(menu.categories)
  && menu.categories.every((category) => (
    category
    && typeof category.id === 'string'
    && Array.isArray(category.items)
  ))
);

const fetchSupabaseMenu = async () => {
  if (!hasSupabaseConfig || !supabase) return null;

  const { data, error } = await supabase
    .from('menu_data')
    .select('menu, settings')
    .eq('id', ROW_ID)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }
  return data;
};

const saveSupabaseMenu = async (payload) => {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase ayarlari eksik.');
  }

  const { error } = await supabase
    .from('menu_data')
    .upsert({
      id: ROW_ID,
      menu: payload.menu,
      settings: payload.settings,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(error.message);
  return payload;
};

const defaultSettings = () => ({
  cafeName: 'İPEK GOLD',
  tagline: 'Cafe & Bistro',
  phone: initialData.contact?.phone || '',
  address: initialData.contact?.address || '',
  instagram: '',
  whatsapp: '',
  instagramIcon: '/social-instagram.png',
  whatsappIcon: '/social-whatsapp.png',
  logo: '/emblem.png',
  heroCtaLabel: 'MENÜYÜ KEŞFET',
  heroScrollLabel: 'KAYDIR',
  copyright: COPYRIGHT_LABEL,
  promo: {
    enabled: false,
    title: 'Günün Önerisi',
    description: '',
    image: '',
    productId: '',
    scheduleEnabled: false,
    startTime: '09:00',
    endTime: '23:59',
    buttonLabel: 'Ürüne Git',
    slots: [
      {
        id: 'morning',
        enabled: true,
        label: 'Kahvaltı saati',
        title: 'Kahvaltı Saati',
        description: 'Güne sıcak bir başlangıç.',
        image: '',
        productId: '',
        startTime: '07:00',
        endTime: '11:30',
        buttonLabel: 'İncele',
      },
      {
        id: 'evening',
        enabled: true,
        label: 'Akşam önerisi',
        title: 'Akşam Keyfi',
        description: 'Pizza, tatlı veya sıcak bir öneri.',
        image: '',
        productId: '',
        startTime: '17:00',
        endTime: '23:59',
        buttonLabel: 'İncele',
      },
    ],
  },
});

const normalizeSettings = (settings = {}) => {
  const defaults = defaultSettings();
  const savedPromo = settings.promo || {};
  const savedSlots = Array.isArray(savedPromo.slots) ? savedPromo.slots : [];
  const promoSlots = defaults.promo.slots.map((slot) => ({
    ...slot,
    ...(savedSlots.find((savedSlot) => savedSlot?.id === slot.id) || {}),
  }));

  return {
    ...defaults,
    ...settings,
    promo: {
      ...defaults.promo,
      ...savedPromo,
      slots: promoSlots,
    },
  };
};

const slugify = (value) => {
  const trMap = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  };

  return String(value || 'kayit')
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (letter) => trMap[letter] || letter)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'kayit';
};

const getAllIds = (categories) => new Set(categories.flatMap((category) => [
  category.id,
  ...category.items.map((item) => item.id),
]));

const uniqueId = (categories, prefix, label) => {
  const usedIds = getAllIds(categories);
  const base = `${prefix}-${slugify(label)}`.replace(/-+/g, '-');
  if (!usedIds.has(base)) return base;

  let index = 2;
  while (usedIds.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
};

const normalizeVariants = (variants = []) => variants
  .map((variant) => ({
    label: String(variant.label || '').trim(),
    price: Number(variant.price),
  }))
  .filter((variant) => variant.label && Number.isFinite(variant.price) && variant.price >= 0);

const clampNumber = (value, fallback, min, max) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(number, min), max);
};

const normalizeProduct = (product, category, categories) => {
  const variants = normalizeVariants(product.variants);
  const hasVariants = variants.length > 0;
  const price = hasVariants
    ? Math.min(...variants.map((variant) => variant.price))
    : Number(product.price || 0);

  const normalized = {
    id: product.id || uniqueId(categories, category.id || 'urun', product.name),
    name: String(product.name || '').trim(),
    desc: String(product.desc || '').trim(),
    price: Number.isFinite(price) ? price : 0,
    tag: String(product.tag || '').trim() || null,
    filterLabel: String(product.filterLabel || '').trim() || null,
    aroma: String(product.aroma || '').trim() || category.label || 'Menü',
    image: String(product.image || '').trim() || category.bgImage || '/hero_cup.png',
    imageZoom: clampNumber(product.imageZoom, 1, 0.65, 2.2),
    imageX: clampNumber(product.imageX, 0, -70, 70),
    imageY: clampNumber(product.imageY, 0, -70, 70),
    isNew: Boolean(product.isNew),
    isAvailable: product.isAvailable !== false,
  };

  if (hasVariants) normalized.variants = variants;

  return normalized;
};

export const useMenuStore = ({ canSaveRemote = false } = {}) => {
  const remoteLoadedRef = useRef(false);
  const lastSavedPayloadRef = useRef('');
  const [menu, setMenu] = useState(() => clone(initialData));
  const [settings, setSettings] = useState(() => defaultSettings());
  const [syncStatus, setSyncStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    if (!hasSupabaseConfig) {
      remoteLoadedRef.current = true;
      setSyncStatus('local');
      return () => {
        cancelled = true;
      };
    }

    fetchSupabaseMenu()
      .then((remoteData) => {
        if (cancelled) return;

        if (remoteData) {
          const remoteSettings = normalizeSettings(remoteData?.settings);
          if (isValidMenu(remoteData.menu)) {
            setMenu(remoteData.menu);
            setSettings(remoteSettings);
            lastSavedPayloadRef.current = JSON.stringify({
              menu: remoteData.menu,
              settings: remoteSettings,
            });
          } else {
            console.warn('Supabase menu data is invalid. Falling back to bundled menu.');
            setSettings(remoteSettings);
          }
        }

        remoteLoadedRef.current = true;
        setSyncStatus('synced');
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Supabase load error:', err);
        remoteLoadedRef.current = false;
        setSyncStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!canSaveRemote || !remoteLoadedRef.current) return undefined;

    const payload = { menu, settings };
    const serializedPayload = JSON.stringify(payload);
    if (serializedPayload === lastSavedPayloadRef.current) return undefined;

    setSyncStatus('saving');

    const timeoutId = window.setTimeout(() => {
      saveSupabaseMenu(payload)
        .then((savedPayload) => {
          lastSavedPayloadRef.current = JSON.stringify({
            menu: savedPayload.menu,
            settings: savedPayload.settings,
          });
          setSyncStatus('synced');
        })
        .catch((err) => {
          console.error('Supabase save error:', err);
          setSyncStatus('error');
        });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [canSaveRemote, menu, settings]);

  const saveProduct = (categoryId, product, originalCategoryId = null) => {
    setMenu((prev) => {
      const targetCategory = prev.categories.find((category) => category.id === categoryId);
      if (!targetCategory || !product.name?.trim()) return prev;

      const normalized = normalizeProduct(product, targetCategory, prev.categories);
      const nextCategories = prev.categories.map((category) => {
        const oldIndex = category.items.findIndex((item) => item.id === normalized.id);
        const withoutOldProduct = oldIndex > -1
          ? category.items.filter((item) => item.id !== normalized.id)
          : category.items;

        if (category.id !== categoryId) {
          return {
            ...category,
            items: originalCategoryId === category.id || itemExists(category.items, normalized.id)
              ? withoutOldProduct
              : category.items,
          };
        }

        const nextItems = [...withoutOldProduct];
        const insertIndex = originalCategoryId === category.id && oldIndex > -1
          ? Math.min(oldIndex, nextItems.length)
          : nextItems.length;
        nextItems.splice(insertIndex, 0, normalized);

        return {
          ...category,
          items: nextItems,
        };
      });

      return { ...prev, categories: nextCategories };
    });
  };

  const deleteProduct = (categoryId, productId) => {
    setMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((category) => (
        category.id === categoryId
          ? { ...category, items: category.items.filter((item) => item.id !== productId) }
          : category
      )),
    }));
  };

  const moveProduct = (categoryId, productId, direction) => {
    setMenu((prev) => ({
      ...prev,
      categories: prev.categories.map((category) => {
        if (category.id !== categoryId) return category;

        const currentIndex = category.items.findIndex((item) => item.id === productId);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= category.items.length) return category;

        const nextItems = [...category.items];
        [nextItems[currentIndex], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[currentIndex]];

        return {
          ...category,
          items: nextItems,
        };
      }),
    }));
  };

  const saveCategory = (category) => {
    setMenu((prev) => {
      const label = String(category.label || '').trim();
      if (!label) return prev;

      const existingIndex = category.id
        ? prev.categories.findIndex((existing) => existing.id === category.id)
        : -1;

      if (existingIndex > -1) {
        return {
          ...prev,
          categories: prev.categories.map((existing) => (
            existing.id === category.id
              ? {
                ...existing,
                label,
                emoji: category.emoji || existing.emoji || '☕',
                tagline: String(category.tagline || '').trim(),
                accentColor: category.accentColor || existing.accentColor || '#C5A059',
                bgImage: category.bgImage || existing.bgImage || '/hero_cup.png',
                video: category.video ?? existing.video ?? null,
              }
              : existing
          )),
        };
      }

      return {
        ...prev,
        categories: [
          ...prev.categories,
          {
            id: uniqueId(prev.categories, 'kategori', label),
            label,
            emoji: category.emoji || '☕',
            video: null,
            bgImage: category.bgImage || '/hero_cup.png',
            accentColor: category.accentColor || '#C5A059',
            tagline: String(category.tagline || '').trim(),
            items: [],
          },
        ],
      };
    });
  };

  const deleteCategory = (categoryId) => {
    setMenu((prev) => ({
      ...prev,
      categories: prev.categories.filter((category) => category.id !== categoryId),
    }));
  };

  const reorderCategories = (newCategories) => {
    setMenu((prev) => ({ ...prev, categories: newCategories }));
  };

  const saveSettings = (nextSettings) => {
    const normalizedSettings = normalizeSettings(nextSettings);
    setSettings(normalizedSettings);
    setMenu((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        phone: normalizedSettings.phone || '',
        address: normalizedSettings.address || '',
      },
    }));
  };

  const resetMenu = () => {
    setMenu(clone(initialData));
    setSettings(defaultSettings());
  };

  return {
    menu,
    saveProduct,
    deleteProduct,
    moveProduct,
    saveCategory,
    deleteCategory,
    reorderCategories,
    settings,
    syncStatus,
    setSettings: saveSettings,
    setMenu,
    resetMenu,
  };
};

const itemExists = (items, productId) => items.some((item) => item.id === productId);
