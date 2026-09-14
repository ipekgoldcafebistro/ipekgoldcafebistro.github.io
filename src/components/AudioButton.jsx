import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const AudioButton = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // Using a free jazz/lounge stream
  const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(AUDIO_URL);
      audioRef.current.volume = 0.15;
      audioRef.current.loop = true;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: 'spring' }}
      whileTap={{ scale: 0.9 }}
      className="fixed z-[70] flex items-center gap-2 glass-card px-3 py-2"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        right: 16,
        borderRadius: 20,
        border: '1px solid rgba(212,175,55,0.2)',
        cursor: 'pointer',
        background: 'rgba(10,10,10,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Sound waves animation */}
      <div className="flex items-center gap-0.5" style={{ height: 16 }}>
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            style={{ width: 2, borderRadius: 1, background: playing ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}
            animate={playing ? {
              height: [4, 12, 4, 10, 4],
              transition: { duration: 0.8, repeat: Infinity, delay: i * 0.15 }
            } : { height: 4 }}
          />
        ))}
      </div>
      <span style={{
        fontSize: '0.6rem',
        color: playing ? '#D4AF37' : 'rgba(255,255,255,0.4)',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {playing ? 'Müzik' : 'Ses Aç'}
      </span>
    </motion.button>
  );
};

export default AudioButton;
