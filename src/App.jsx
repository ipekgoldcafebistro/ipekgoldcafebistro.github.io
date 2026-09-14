import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MenuLayout from './components/MenuLayout';
import './index.css';

import { supabase } from './lib/supabase';
const AdminApp = lazy(() => import('./admin/AdminApp'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));

const AdminFallback = () => (
  <div
    className="flex h-full w-full items-center justify-center bg-[#FDFBF7]"
    style={{
      color: '#C5A059',
      fontWeight: 900,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      fontSize: '0.72rem',
    }}
  >
    Yükleniyor
  </div>
);

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(Boolean(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    void supabase?.auth.signOut();
  };

  return (
    <BrowserRouter>
      <div style={{ width: '100%', height: '100dvh', overflow: 'hidden', background: '#000' }}>
        <Routes>
          <Route
            path="/"
            element={<MenuLayout />}
          />

          <Route
            path="/admin/login"
            element={(
              isAdminAuthenticated ? (
                <Navigate to="/admin" />
              ) : (
                <Suspense fallback={<AdminFallback />}>
                  <AdminLogin onLogin={handleAdminLogin} />
                </Suspense>
              )
            )}
          />

          <Route
            path="/admin/*"
            element={(
              isAdminAuthenticated ? (
                <Suspense fallback={<AdminFallback />}>
                  <AdminApp onLogout={handleAdminLogout} />
                </Suspense>
              ) : (
                <Navigate to="/admin/login" />
              )
            )}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
