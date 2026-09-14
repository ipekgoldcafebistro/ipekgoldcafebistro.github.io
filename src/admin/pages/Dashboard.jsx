import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  FolderPlus,
  FolderTree,
  Plus,
  Settings,
  Utensils,
} from 'lucide-react';

const Dashboard = ({ menu }) => {
  const stats = useMemo(() => {
    const products = menu.categories.flatMap((category) => category.items);
    return [
      { label: 'Kategori', value: menu.categories.length },
      { label: 'Ürün', value: products.length },
      { label: 'Seçenek', value: products.filter((product) => product.variants?.length).length },
    ];
  }, [menu.categories]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 lg:space-y-6">
      <section className="overflow-hidden rounded-[28px] bg-[#2A2421] p-5 text-white shadow-2xl shadow-black/10 lg:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#E3B84E]">Admin</p>
            <h1 className="mt-2 text-2xl font-black leading-tight lg:text-3xl">Menü kontrolü</h1>
            <p className="mt-2 max-w-sm text-sm font-medium leading-5 text-white/62">
              Ürün, kategori, fiyat ve açıklamaları hızlıca düzenle.
            </p>
          </div>
          <Link
            to="/?menu=1"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white hover:text-[#2A2421]"
            aria-label="Menüyü aç"
          >
            <Eye size={19} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/[0.08] px-2 py-3 text-center ring-1 ring-white/10">
              <p className="text-xl font-black leading-none text-white lg:text-2xl">{stat.value}</p>
              <p className="mt-1 truncate text-[8px] font-black uppercase tracking-[0.08em] text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <PrimaryAction to="/admin/products/new" icon={Plus} title="Ürün Ekle" detail="Yeni menü ürünü oluştur" />
        <PrimaryAction to="/admin/products" icon={Utensils} title="Ürünleri Düzenle" detail="Fiyat, açıklama, görsel" />
      </section>

      <section className="space-y-2">
        <SectionTitle>Kısa yollar</SectionTitle>
        <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          <ListAction to="/admin/categories/new" icon={FolderPlus} title="Kategori Ekle" />
          <ListAction to="/admin/categories" icon={FolderTree} title="Kategorileri Düzenle" />
          <ListAction to="/admin/settings" icon={Settings} title="İşletme Ayarları" />
          <ListAction to="/?menu=1" icon={Eye} title="Canlı Menüyü Aç" />
        </div>
      </section>
    </motion.div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 px-1">
    <h2 className="text-[9px] font-black uppercase tracking-[0.22em] text-[#9A8F83]">{children}</h2>
    <span className="h-px flex-1 bg-black/7" />
  </div>
);

const PrimaryAction = ({ to, icon: Icon, title, detail }) => (
  <Link
    to={to}
    className="flex items-center gap-4 rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/[0.05]"
  >
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E3B84E]/14 text-[#B88A2E]">
      <Icon size={21} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-base font-black leading-tight text-[#2A2421]">{title}</span>
      <span className="mt-1 block truncate text-xs font-bold text-gray-400">{detail}</span>
    </span>
    <ArrowRight size={18} className="text-gray-300" />
  </Link>
);

const ListAction = ({ to, icon: Icon, title }) => (
  <Link
    to={to}
    className="flex h-14 items-center gap-3 rounded-[20px] border border-black/[0.05] bg-white px-4 shadow-sm transition hover:bg-[#2A2421] hover:text-white"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F6F1E8] text-[#B88A2E]">
      <Icon size={18} />
    </span>
    <span className="flex-1 text-sm font-black">{title}</span>
    <ArrowRight size={17} className="text-gray-300" />
  </Link>
);

export default Dashboard;
