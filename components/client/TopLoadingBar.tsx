"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopLoadingBarProps {
  isLoading: boolean;
  duration?: number;
}

export default function TopLoadingBar({ isLoading, duration = 800 }: TopLoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      
      // Simulate progressive loading
      const intervals = [
        { time: 100, progress: 20 },
        { time: 300, progress: 50 },
        { time: 500, progress: 70 },
        { time: 700, progress: 90 },
      ];

      const timeouts = intervals.map(({ time, progress: targetProgress }) =>
        setTimeout(() => {
          if (isLoading) {
            setProgress(targetProgress);
          }
        }, time)
      );

      // Complete the loading
      const completeTimeout = setTimeout(() => {
        setProgress(100);
        // Reset after completion animation
        setTimeout(() => {
          if (!isLoading) {
            setProgress(0);
          }
        }, 200);
      }, duration);

      return () => {
        timeouts.forEach(clearTimeout);
        clearTimeout(completeTimeout);
      };
    } else {
      // Complete immediately if loading stops
      setProgress(100);
      const resetTimeout = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(resetTimeout);
    }
  }, [isLoading, duration]);

  return (
    <AnimatePresence>
      {(isLoading || progress > 0) && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #D4AF37 0%, #F5D76E 50%, #D4AF37 100%)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
            }}
            initial={{ width: '0%', opacity: 0 }}
            animate={{ 
              width: `${progress}%`,
              opacity: progress > 0 ? 1 : 0
            }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            transition={{
              width: { 
                duration: progress === 100 ? 0.2 : 0.4,
                ease: progress === 100 ? "easeOut" : "easeInOut"
              },
              opacity: { duration: 0.1 }
            }}
          />
          
          {/* Animated shimmer effect */}
          {/* <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: progress > 0 && progress < 100 ? ['0%', '300%'] : '0%',
            }}
            transition={{
              repeat: progress > 0 && progress < 100 ? Infinity : 0,
              duration: 1,
              ease: "linear",
            }}
          /> */}
        </div>
      )}
    </AnimatePresence>
  );
}