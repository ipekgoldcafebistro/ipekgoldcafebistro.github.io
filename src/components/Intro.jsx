import React from 'react';
import CoffeeBackdrop from './CoffeeBackdrop';
import { COPYRIGHT_LABEL } from '../constants/branding';

const Intro = ({ onComplete }) => {
  const phoneRaw = '905308239232'; // WhatsApp için ülke kodlu telefon
  const phoneDisplay = '0530 823 92 32';
  const addressDisplay = 'Asıl Kale Mah. 131. Konya Cad. No:38 Şarkikaraağaç/Isparta';
  const instagramHandle = 'ipekgold_cafe_bistro';

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden bg-[#FDFBF7] py-8 px-6 font-sans select-none cursor-pointer"
    >
      {/* Arka plan dokusu ve hafif gold ışıltısı */}
      <CoffeeBackdrop opacity={0.15} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(197, 160, 89, 0.12), transparent 50%), linear-gradient(to bottom, #FDFBF7 0%, rgba(253, 251, 247, 0.5) 50%, #FDFBF7 100%)',
        }}
      />

      {/* ÜST BÖLÜM: Logo ve Başlıklar */}
      <div className="relative z-10 flex flex-col items-center w-full mt-6">
        {/* Butterfly Emblem */}
        <img
          src="/emblem.png"
          alt="İpek Gold Logo"
          className="w-24 h-24 object-contain mb-8 animate-fade-in"
          style={{
            filter: 'drop-shadow(0px 4px 8px rgba(197, 160, 89, 0.25))',
          }}
        />

        {/* Cafe & Bistro Title with side lines */}
        <div className="flex items-center gap-4 w-full max-w-[280px] mb-2 justify-center">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
          <span className="text-[#C5A059] text-[0.72rem] tracking-[0.32em] font-semibold uppercase font-sans">
            CAFE & BİSTRO
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
        </div>

        {/* Main Title */}
        <h1
          className="text-[#2C251C] text-[3rem] font-extrabold tracking-tight leading-none mb-1"
          style={{
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          İPEK
          <br />
          GOLD
        </h1>

        <span className="text-[#8B8476] text-[0.68rem] tracking-[0.35em] uppercase font-medium mb-6 mt-3">
          QR MENÜ
        </span>

        {/* Contact Info */}
        <div 
          className="flex flex-col items-center gap-1.5 text-center px-4 max-w-[320px]"
          onClick={(e) => e.stopPropagation()} // Butonlara tıklanınca menüye girmemesi için
        >
          <a
            href={`tel:${phoneRaw}`}
            className="text-[#5C5549] text-[0.82rem] font-semibold tracking-wider hover:text-[#C5A059] transition-colors"
          >
            {phoneDisplay}
          </a>
          <p className="text-[#8B8476] text-[0.76rem] leading-relaxed font-sans font-normal">
            {addressDisplay}
          </p>
        </div>
      </div>

      {/* ORTA BÖLÜM: Sosyal Medya ve Keşfet Butonu */}
      <div 
        className="relative z-10 flex flex-col items-center w-full max-w-[340px] gap-6 my-auto"
        onClick={(e) => e.stopPropagation()} // Sosyal medya butonlarına tıklanınca menüye girmemesi için
      >
        {/* Social Media Buttons Row */}
        <div className="flex items-center justify-center gap-3 w-full">
          {/* Instagram Button */}
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-2xl p-[2px] shadow-md hover:shadow-lg transition-all duration-300 flex-1 active:scale-95 group"
          >
            <div className="flex items-center gap-2.5 bg-white w-full h-full rounded-2xl px-3 py-2.5 justify-center group-hover:bg-opacity-90 transition-all">
              <img src="/social-instagram.png" alt="Instagram" className="w-[22px] h-[22px] object-contain" />
              <span className="text-[#2C251C] text-[0.76rem] font-semibold tracking-wide font-sans">
                Instagram
              </span>
            </div>
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${phoneRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#25D366] rounded-2xl px-3 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 flex-1 justify-center active:scale-95"
          >
            <img src="/social-whatsapp.png" alt="WhatsApp" className="w-[22px] h-[22px] object-contain brightness-0 invert" />
            <span className="text-white text-[0.76rem] font-semibold tracking-wide font-sans">
              WhatsApp
            </span>
          </a>
        </div>

        {/* CTA "MENÜYÜ KEŞFET" Button */}
        <button
          onClick={onComplete}
          className="relative w-full overflow-hidden rounded-full py-4 px-8 text-center text-white text-[0.88rem] font-bold tracking-[0.16em] uppercase shadow-lg shadow-[#C5A059]/20 hover:shadow-xl hover:shadow-[#C5A059]/30 transition-all duration-300 active:scale-95 cursor-pointer mt-4"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B89028 100%)',
          }}
        >
          {/* Shine effect overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" />
          MENÜYE GİRİŞ YAP
        </button>

        {/* Scroll Indicator */}
        <button
          onClick={onComplete}
          className="flex flex-col items-center gap-1.5 mt-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer active:scale-95"
        >
          <span className="text-[#8B8476] text-[0.62rem] tracking-[0.24em] uppercase font-bold">
            DOKUN VEYA KAYDIR
          </span>
          <svg
            className="w-4 h-4 text-[#C5A059] animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* ALT BÖLÜM: Copyright */}
      <div className="relative z-10 w-full text-center mt-6 pointer-events-none">
        <span className="text-[#8B8476] text-[0.6rem] tracking-[0.16em] uppercase font-bold">
          {COPYRIGHT_LABEL}
        </span>
      </div>
    </div>
  );
};

export default Intro;
