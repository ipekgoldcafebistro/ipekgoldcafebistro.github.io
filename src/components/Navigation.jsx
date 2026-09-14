import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Cake, Wine, Utensils, Star } from 'lucide-react';

const NavItem = ({ icon: Icon, label, href, active }) => (
  <motion.a
    href={href}
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.9 }}
    className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 ${active ? 'text-amber-500' : 'text-white/40 hover:text-white/80'}`}
  >
    <div className={`p-2 rounded-xl ${active ? 'bg-amber-500/10' : ''}`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="absolute -bottom-1 w-1 h-1 bg-amber-500 rounded-full"
      />
    )}
  </motion.a>
);

const Navigation = () => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px]">
      <div className="glass rounded-3xl p-4 shadow-2xl flex items-center justify-around border border-white/5 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shine_5s_infinite]" />
        
        <NavItem icon={Coffee} label="Kahve" href="#coffee" active={true} />
        <NavItem icon={Cake} label="Tatlı" href="#desserts" />
        <NavItem icon={Wine} label="Kokteyl" href="#cocktails" />
        <NavItem icon={Utensils} label="Bistro" href="#bistro" />
        <NavItem icon={Star} label="Özel" href="#special" />
      </div>
    </div>
  );
};

export default Navigation;
