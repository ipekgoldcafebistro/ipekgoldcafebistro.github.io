import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, RotateCcw, Save, Upload } from 'lucide-react';
import { optimizeImageFile } from '../../utils/imageTools';

const Settings = ({ menu, settings, setSettings, resetMenu }) => {
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);
  const products = useMemo(() => (
    menu.categories.flatMap((category) => category.items.map((product) => ({
      ...product,
      categoryLabel: category.label,
    })))
  ), [menu.categories]);
  const promo = formData.promo || {};
  const promoSlots = Array.isArray(promo.slots) ? promo.slots : [];
  const selectedPromoProduct = products.find((product) => product.id === promo.productId);
  const promoPreview = promo.image || selectedPromoProduct?.image || '/hero_cup.png';

  const updatePromo = (updates) => {
    setFormData((current) => ({
      ...current,
      promo: {
        ...(current.promo || {}),
        ...updates,
      },
    }));
  };

  const updatePromoSlot = (slotId, updates) => {
    setFormData((current) => {
      const currentPromo = current.promo || {};
      const currentSlots = Array.isArray(currentPromo.slots) ? currentPromo.slots : [];

      return {
        ...current,
        promo: {
          ...currentPromo,
          slots: currentSlots.map((slot) => (
            slot.id === slotId ? { ...slot, ...updates } : slot
          )),
        },
      };
    });
  };

  const handlePromoImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    optimizeImageFile(file).then((image) => {
      if (!image) return;
      updatePromo({ image });
    });
  };

  const handleLogoImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    optimizeImageFile(file, { maxSide: 640, quality: 0.86 }).then((image) => {
      if (!image) return;
      setFormData((current) => ({ ...current, logo: image }));
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSettings(formData);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl space-y-4 lg:space-y-6">
      <header className="rounded-[26px] bg-[#2A2421] p-5 text-white lg:p-7">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#E3B84E]">Ayarlar</p>
        <h1 className="mt-1 text-2xl font-black leading-tight lg:text-3xl">İşletme Bilgileri</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm lg:space-y-6 lg:rounded-[32px] lg:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <InputGroup label="İşletme adı">
            <input
              type="text"
              value={formData.cafeName}
              onChange={(event) => setFormData({ ...formData, cafeName: event.target.value })}
              className="studio-input"
            />
          </InputGroup>
          <InputGroup label="Alt başlık">
            <input
              type="text"
              value={formData.tagline}
              onChange={(event) => setFormData({ ...formData, tagline: event.target.value })}
              className="studio-input"
            />
          </InputGroup>
        </div>

        <section className="rounded-[28px] border border-[#C5A059]/18 bg-[#FDFBF7] p-4 lg:p-5">
          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B88A2E]">Giriş Ekranı</p>
            <h2 className="mt-1 text-xl font-black leading-tight text-[#2A2421]">QR karşılama tasarımı</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_160px]">
            <div className="space-y-5">
              <InputGroup label="Logo / kelebek görsel yolu">
                <input
                  type="text"
                  value={formData.logo || ''}
                  onChange={(event) => setFormData({ ...formData, logo: event.target.value })}
                  className="studio-input"
                  placeholder="/emblem.png"
                />
              </InputGroup>

              <div className="grid gap-5 lg:grid-cols-2">
                <InputGroup label="Keşfet butonu">
                  <input
                    type="text"
                    value={formData.heroCtaLabel || ''}
                    onChange={(event) => setFormData({ ...formData, heroCtaLabel: event.target.value })}
                    className="studio-input"
                  />
                </InputGroup>
                <InputGroup label="Kaydır metni">
                  <input
                    type="text"
                    value={formData.heroScrollLabel || ''}
                    onChange={(event) => setFormData({ ...formData, heroScrollLabel: event.target.value })}
                    className="studio-input"
                  />
                </InputGroup>
              </div>

              <InputGroup label="Alt imza">
                <input
                  type="text"
                  value={formData.copyright || ''}
                  onChange={(event) => setFormData({ ...formData, copyright: event.target.value })}
                  className="studio-input"
                />
              </InputGroup>
            </div>

            <aside className="space-y-3">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[24px] border border-black/5 bg-white p-5 shadow-sm">
                <img src={formData.logo || '/emblem.png'} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A2421] px-4 py-3 text-sm font-black text-white transition hover:bg-[#C5A059]">
                <Upload size={17} />
                Logo Yükle
                <input type="file" accept="image/*" onChange={handleLogoImageChange} className="hidden" />
              </label>
            </aside>
          </div>
        </section>

        <InputGroup label="Telefon">
          <input
            type="text"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            className="studio-input"
          />
        </InputGroup>

        <InputGroup label="Adres">
          <textarea
            value={formData.address}
            onChange={(event) => setFormData({ ...formData, address: event.target.value })}
            className="studio-input min-h-28 resize-none"
          />
        </InputGroup>

        <div className="grid gap-5 lg:grid-cols-2">
          <InputGroup label="Instagram">
            <input
              type="text"
              value={formData.instagram}
              onChange={(event) => setFormData({ ...formData, instagram: event.target.value })}
              className="studio-input"
            />
          </InputGroup>
          <InputGroup label="WhatsApp">
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(event) => setFormData({ ...formData, whatsapp: event.target.value })}
              className="studio-input"
            />
          </InputGroup>
        </div>

        <section className="rounded-[28px] border border-[#C5A059]/18 bg-[#FDFBF7] p-4 lg:p-5">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#C5A059]/14 text-[#B88A2E]">
                <Megaphone size={20} />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#B88A2E]">Reklam</p>
                <h2 className="mt-1 text-xl font-black leading-tight text-[#2A2421]">Keşfet sonrası reklam</h2>
                <p className="mt-1 max-w-md text-sm font-medium leading-5 text-gray-500">
                  Menüyü keşfet tuşundan sonra çıkacak görsel ve ürün kısayolu.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updatePromo({ enabled: !promo.enabled })}
              className={`h-12 rounded-full px-5 text-xs font-black uppercase tracking-[0.12em] transition ${
                promo.enabled ? 'bg-[#2A2421] text-white' : 'bg-white text-gray-400 hover:bg-black/5 hover:text-[#2A2421]'
              }`}
            >
              {promo.enabled ? 'Aktif' : 'Kapalı'}
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <InputGroup label="Reklam başlığı">
                  <input
                    type="text"
                    value={promo.title || ''}
                    onChange={(event) => updatePromo({ title: event.target.value })}
                    className="studio-input"
                  />
                </InputGroup>

                <InputGroup label="Buton yazısı">
                  <input
                    type="text"
                    value={promo.buttonLabel || ''}
                    onChange={(event) => updatePromo({ buttonLabel: event.target.value })}
                    className="studio-input"
                  />
                </InputGroup>
              </div>

              <InputGroup label="Reklam açıklaması">
                <textarea
                  value={promo.description || ''}
                  onChange={(event) => updatePromo({ description: event.target.value })}
                  className="studio-input min-h-24 resize-none"
                />
              </InputGroup>

              <InputGroup label="Kısa yol ürünü">
                <select
                  value={promo.productId || ''}
                  onChange={(event) => updatePromo({ productId: event.target.value })}
                  className="studio-input"
                >
                  <option value="">Ürün seçilmedi</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.categoryLabel} / {product.name}
                    </option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup label="Reklam görsel yolu">
                <input
                  type="text"
                  value={promo.image || ''}
                  onChange={(event) => updatePromo({ image: event.target.value })}
                  className="studio-input"
                  placeholder="Boş kalırsa seçilen ürün görseli kullanılır"
                />
              </InputGroup>
              <section className="rounded-[24px] border border-black/5 bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Saat planı</p>
                    <p className="mt-1 text-xs font-bold text-gray-500">Sadece belirli saatlerde göster.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updatePromo({ scheduleEnabled: !promo.scheduleEnabled })}
                    className={`h-10 rounded-full px-4 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                      promo.scheduleEnabled ? 'bg-[#2A2421] text-white' : 'bg-[#FDFBF7] text-gray-400 hover:bg-black/5 hover:text-[#2A2421]'
                    }`}
                  >
                    {promo.scheduleEnabled ? 'Aktif' : 'Kapalı'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InputGroup label="Başlangıç">
                    <input
                      type="time"
                      value={promo.startTime || '09:00'}
                      onChange={(event) => updatePromo({ startTime: event.target.value })}
                      className="studio-input !rounded-2xl !px-4 !py-3"
                    />
                  </InputGroup>
                  <InputGroup label="Bitiş">
                    <input
                      type="time"
                      value={promo.endTime || '23:59'}
                      onChange={(event) => updatePromo({ endTime: event.target.value })}
                      className="studio-input !rounded-2xl !px-4 !py-3"
                    />
                  </InputGroup>
                </div>
              </section>

              <section className="rounded-[24px] border border-black/5 bg-white p-4">
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Planlı reklamlar</p>
                  <p className="mt-1 text-xs font-bold text-gray-500">
                    Saat planı aktifken uygun saate göre bu reklamlar çıkar.
                  </p>
                </div>

                <div className="space-y-3">
                  {promoSlots.map((slot) => (
                    <div key={slot.id} className="rounded-[22px] border border-black/5 bg-[#FDFBF7] p-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-[#2A2421]">{slot.label}</p>
                          <p className="text-[11px] font-bold text-gray-400">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => updatePromoSlot(slot.id, { enabled: !slot.enabled })}
                          className={`h-9 rounded-full px-3 text-[10px] font-black uppercase tracking-[0.1em] transition ${
                            slot.enabled ? 'bg-[#2A2421] text-white' : 'bg-white text-gray-400 hover:bg-black/5 hover:text-[#2A2421]'
                          }`}
                        >
                          {slot.enabled ? 'Aktif' : 'Kapalı'}
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <InputGroup label="Başlangıç">
                          <input
                            type="time"
                            value={slot.startTime || '09:00'}
                            onChange={(event) => updatePromoSlot(slot.id, { startTime: event.target.value })}
                            className="studio-input !rounded-2xl !px-4 !py-3"
                          />
                        </InputGroup>
                        <InputGroup label="Bitiş">
                          <input
                            type="time"
                            value={slot.endTime || '23:59'}
                            onChange={(event) => updatePromoSlot(slot.id, { endTime: event.target.value })}
                            className="studio-input !rounded-2xl !px-4 !py-3"
                          />
                        </InputGroup>
                      </div>

                      <InputGroup label="Ürün">
                        <select
                          value={slot.productId || ''}
                          onChange={(event) => updatePromoSlot(slot.id, { productId: event.target.value })}
                          className="studio-input !rounded-2xl !px-4 !py-3"
                        >
                          <option value="">Ana reklam ürünü kullanılsın</option>
                          {products.map((product) => (
                            <option key={`${slot.id}-${product.id}`} value={product.id}>
                              {product.categoryLabel} / {product.name}
                            </option>
                          ))}
                        </select>
                      </InputGroup>

                      <InputGroup label="Görsel yolu">
                        <input
                          type="text"
                          value={slot.image || ''}
                          onChange={(event) => updatePromoSlot(slot.id, { image: event.target.value })}
                          className="studio-input !rounded-2xl !px-4 !py-3"
                          placeholder="Boşsa ürün veya ana reklam görseli kullanılır"
                        />
                      </InputGroup>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <InputGroup label="Başlık">
                          <input
                            type="text"
                            value={slot.title || ''}
                            onChange={(event) => updatePromoSlot(slot.id, { title: event.target.value })}
                            className="studio-input !rounded-2xl !px-4 !py-3"
                          />
                        </InputGroup>
                        <InputGroup label="Buton">
                          <input
                            type="text"
                            value={slot.buttonLabel || ''}
                            onChange={(event) => updatePromoSlot(slot.id, { buttonLabel: event.target.value })}
                            className="studio-input !rounded-2xl !px-4 !py-3"
                          />
                        </InputGroup>
                      </div>

                      <InputGroup label="Açıklama">
                        <textarea
                          value={slot.description || ''}
                          onChange={(event) => updatePromoSlot(slot.id, { description: event.target.value })}
                          className="studio-input min-h-20 !rounded-2xl !px-4 !py-3"
                        />
                      </InputGroup>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-3">
              <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-sm">
                <div className="aspect-[4/5] bg-[#FDFBF7] p-4">
                  <img src={promoPreview} alt="" className="h-full w-full object-contain" />
                </div>
                {selectedPromoProduct && (
                  <div className="border-t border-black/5 px-4 py-3">
                    <p className="truncate text-sm font-black text-[#2A2421]">{selectedPromoProduct.name}</p>
                    <p className="text-xs font-bold text-gray-400">{selectedPromoProduct.categoryLabel}</p>
                  </div>
                )}
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A2421] px-4 py-3 text-sm font-black text-white transition hover:bg-[#C5A059]">
                <Upload size={17} />
                Görsel Yükle
                <input type="file" accept="image/*" onChange={handlePromoImageChange} className="hidden" />
              </label>

              {promo.image && (
                <button
                  type="button"
                  onClick={() => updatePromo({ image: '' })}
                  className="w-full rounded-full bg-white px-4 py-3 text-sm font-black text-gray-500 transition hover:bg-black/5 hover:text-[#2A2421]"
                >
                  Görseli Temizle
                </button>
              )}
            </aside>
          </div>
        </section>

        {saved && (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-black text-green-600">
            Kaydedildi.
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <button type="submit" className="studio-submit-btn inline-flex items-center justify-center gap-3">
            <Save size={18} />
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => window.confirm('Menüyü ilk haline döndürmek istiyor musunuz?') && resetMenu()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-4 text-sm font-black text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            <RotateCcw size={17} />
            Sıfırla
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const InputGroup = ({ label, children }) => (
  <label className="block space-y-2">
    <span className="block px-1 text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">
      {label}
    </span>
    {children}
  </label>
);

export default Settings;
