import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const AudioControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef(null);

  // Royalty-free lounge music placeholder
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Optional: Show tooltip after a delay to encourage engagement
    const timer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed top-8 right-8 z-[110]">
      <div className="relative">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="glass px-4 py-2 rounded-full text-[10px] uppercase tracking-widest text-amber-500 font-bold border border-amber-500/20">
                Enhance Experience?
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAudio}
          className={`w-12 h-12 rounded-full glass flex items-center justify-center border border-white/10 ${isPlaying ? 'text-amber-500 shadow-[0_0_20px_rgba(255,191,0,0.2)]' : 'text-white/60'}`}
        >
          {isPlaying ? (
            <div className="relative">
              <Volume2 size={20} />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-amber-500 rounded-full -z-10"
              />
            </div>
          ) : (
            <VolumeX size={20} />
          )}
        </motion.button>
      </div>

      <audio 
        ref={audioRef} 
        src={musicUrl} 
        loop 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioControls;
