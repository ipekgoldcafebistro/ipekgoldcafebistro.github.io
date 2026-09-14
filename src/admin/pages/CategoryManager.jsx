import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const CategoryManager = ({ menu, deleteCategory }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 lg:space-y-6">
    <header className="flex flex-col gap-4 rounded-[26px] bg-[#2A2421] p-5 text-white lg:flex-row lg:items-center lg:justify-between lg:p-7">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#E3B84E]">Kategoriler</p>
        <h1 className="mt-1 text-2xl font-black leading-tight lg:text-3xl">Menü Kategorileri</h1>
        <p className="mt-1 text-sm font-bold text-white/50">{menu.categories.length} kategori</p>
      </div>
      <Link
        to="/admin/categories/new"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#2A2421] transition hover:bg-[#E3B84E]"
      >
        <Plus size={18} />
        Kategori Ekle
      </Link>
    </header>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {menu.categories.map((category) => (
        <CategoryCard key={category.id} category={category} deleteCategory={deleteCategory} />
      ))}
    </div>
  </motion.div>
);

const CategoryCard = ({ category, deleteCategory }) => (
  <div className="rounded-[22px] border border-black/5 bg-white p-4 shadow-sm transition hover:border-black/10 hover:shadow-xl hover:shadow-black/[0.04] lg:rounded-[26px] lg:p-5">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl lg:h-14 lg:w-14"
          style={{ background: `${category.accentColor || '#C5A059'}14` }}
        >
          {category.emoji}
        </div>
        <div>
          <h2 className="text-lg font-black text-[#2A2421] lg:text-xl">{category.label}</h2>
          <p className="text-sm font-bold text-gray-400">{category.items.length} ürün</p>
        </div>
      </div>
      <span className="h-4 w-4 rounded-full border border-black/5" style={{ backgroundColor: category.accentColor || '#C5A059' }} />
    </div>

    <p className="min-h-10 text-sm font-medium leading-5 text-gray-500">{category.tagline || 'Açıklama yok'}</p>

    <div className="mt-5 flex gap-2">
      <Link
        to={`/admin/categories/edit/${category.id}`}
        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-black/5 text-sm font-black text-gray-500 transition hover:bg-gold hover:text-white"
      >
        <Pencil size={16} />
        Düzenle
      </Link>
      <button
        type="button"
        onClick={() => window.confirm('Bu kategoriyi ve içindeki ürünleri silmek istiyor musunuz?') && deleteCategory(category.id)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/5 text-gray-500 transition hover:bg-red-500 hover:text-white"
        aria-label="Kategoriyi sil"
      >
        <Trash2 size={17} />
      </button>
    </div>
  </div>
);

export default CategoryManager;
