import React, { useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Eye,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  Utensils,
} from 'lucide-react';
import { useMenuStore } from '../hooks/useMenuStore';
import Dashboard from './pages/Dashboard';
import ProductManager from './pages/ProductManager';
import CategoryManager from './pages/CategoryManager';
import Settings from './pages/Settings';
import { CategoryEditor, ProductEditor } from './components/EditorForms';

const AdminApp = ({ onLogout }) => {
  const {
    menu,
    saveProduct,
    deleteProduct,
    moveProduct,
    saveCategory,
    deleteCategory,
    settings,
    syncStatus,
    setSettings,
    resetMenu,
  } = useMenuStore({ canSaveRemote: true });
  const location = useLocation();
  const shellRef = useRef(null);

  useEffect(() => {
    if (shellRef.current) shellRef.current.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div
      ref={shellRef}
      className="bg-[#F6F1E8] text-[#2A2421] font-inter"
      style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden', width: '100vw' }}
    >
      <header className="z-[150] px-4 pt-3 lg:sticky lg:top-0 lg:border-b lg:border-black/[0.06] lg:bg-[#F6F1E8]/94 lg:px-10 lg:py-4 lg:backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[480px] items-center justify-between gap-4 rounded-[24px] border border-black/5 bg-white/94 px-4 py-3 shadow-sm sm:max-w-6xl lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
          <Link to="/admin" className="min-w-0">
            <span className="block text-[8px] font-black uppercase tracking-[0.22em] text-[#B88A2E]">
              İpek Gold
            </span>
            <span className="block truncate text-lg font-black leading-tight text-[#2A2421] lg:text-xl">
              Menü Yönetimi
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-black/5 bg-white/90 p-1 shadow-sm lg:flex">
            <TopLink to="/admin" icon={LayoutDashboard} label="Özet" active={location.pathname === '/admin'} />
            <TopLink to="/admin/products" icon={Utensils} label="Ürünler" active={location.pathname.startsWith('/admin/products')} />
            <TopLink to="/admin/categories" icon={FolderTree} label="Kategoriler" active={location.pathname.startsWith('/admin/categories')} />
            <TopLink to="/admin/settings" icon={SettingsIcon} label="Ayarlar" active={location.pathname.startsWith('/admin/settings')} />
          </nav>

          <div className="flex items-center gap-2">
            <SyncBadge status={syncStatus} />
            <Link
              to="/?menu=1"
              className="hidden h-10 items-center gap-2 rounded-full border border-[#B88A2E]/20 bg-[#B88A2E]/10 px-4 text-xs font-black text-[#B88A2E] transition hover:bg-[#B88A2E] hover:text-white sm:flex"
            >
              <Eye size={17} />
              Menüyü Aç
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/95 text-gray-500 transition hover:bg-red-500 hover:text-white"
              aria-label="Çıkış yap"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[480px] px-4 pb-28 pt-4 sm:max-w-6xl lg:px-10 lg:pb-14 lg:pt-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard menu={menu} />} />
            <Route path="/products" element={<ProductManager menu={menu} deleteProduct={deleteProduct} moveProduct={moveProduct} />} />
            <Route path="/products/new" element={<ProductEditor menu={menu} saveProduct={saveProduct} />} />
            <Route path="/products/edit/:catId/:prodId" element={<ProductEditor menu={menu} saveProduct={saveProduct} />} />
            <Route path="/categories" element={<CategoryManager menu={menu} deleteCategory={deleteCategory} />} />
            <Route path="/categories/new" element={<CategoryEditor saveCategory={saveCategory} />} />
            <Route path="/categories/edit/:catId" element={<CategoryEditor menu={menu} saveCategory={saveCategory} />} />
            <Route path="/settings" element={<Settings menu={menu} settings={settings} setSettings={setSettings} resetMenu={resetMenu} />} />
          </Routes>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-3 left-1/2 z-[200] w-[calc(100%-24px)] max-w-[456px] -translate-x-1/2 rounded-[22px] border border-black/10 bg-white/94 p-1.5 shadow-2xl shadow-black/10 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          <TabLink to="/admin" icon={LayoutDashboard} label="Özet" active={location.pathname === '/admin'} />
          <TabLink to="/admin/products" icon={Utensils} label="Ürün" active={location.pathname.startsWith('/admin/products')} />
          <TabLink to="/admin/categories" icon={FolderTree} label="Kategori" active={location.pathname.startsWith('/admin/categories')} />
          <TabLink to="/admin/settings" icon={SettingsIcon} label="Ayar" active={location.pathname.startsWith('/admin/settings')} />
          <TabLink to="/?menu=1" icon={Eye} label="Menü" active={false} />
        </div>
      </nav>
    </div>
  );
};

const TopLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex h-11 items-center gap-2 rounded-full px-4 text-xs font-black transition ${
      active ? 'bg-[#2A2421] text-white' : 'text-gray-500 hover:bg-black/5 hover:text-[#2A2421]'
    }`}
  >
    <Icon size={17} />
    {label}
  </Link>
);

const syncLabels = {
  saving: 'Kaydediliyor',
  synced: 'Kaydedildi',
  error: 'Baglanti hatasi',
  local: 'Yerel mod',
};

const SyncBadge = ({ status }) => (
  <span
    className={`hidden h-10 items-center rounded-full px-3 text-[10px] font-black uppercase tracking-[0.12em] sm:inline-flex ${
      status === 'error'
        ? 'bg-red-50 text-red-500'
        : status === 'saving'
          ? 'bg-[#FDFBF7] text-[#B88A2E]'
          : 'bg-emerald-50 text-emerald-600'
    }`}
  >
    {syncLabels[status] || syncLabels.local}
  </span>
);

const TabLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center gap-1 rounded-[17px] py-2.5 text-[8px] font-black transition ${
      active ? 'bg-[#2A2421] text-[#E3B84E]' : 'text-gray-400 hover:bg-black/5 hover:text-[#2A2421]'
    }`}
  >
    <Icon size={17} />
    {label}
  </Link>
);

export default AdminApp;
