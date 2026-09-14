import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, UserRound } from 'lucide-react';

import { supabase } from '../lib/supabase';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!supabase) { setError(true); return; }
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: username.trim(), password });
    const isValid = !loginError;

    if (isValid) {
      onLogin();
      return;
    }

    setError(true);
    window.setTimeout(() => setError(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#FDFBF7] p-6">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(197,160,89,0.18),transparent_68%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-[360px] rounded-[28px] border border-black/5 bg-white p-7 shadow-2xl shadow-black/[0.06]"
      >
        <div className="mb-7 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gold">İpek Gold</p>
          <h1 className="mt-2 font-playfair text-4xl font-bold text-[#2A2421]">Yönetim</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block px-1 text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
              E-posta
            </span>
            <div className="relative">
              <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
              <input
                type="email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="studio-input pl-12"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block px-1 text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
              Şifre
            </span>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`studio-input pl-12 ${error ? 'border-red-400 bg-red-50' : ''}`}
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-500">
              Giriş yapılamadı. E-posta, şifre ve bağlantıyı kontrol edin.
            </p>
          )}

          <button type="submit" className="studio-submit-btn">
            Giriş Yap
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
