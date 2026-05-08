"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [stage, setStage] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Try to play audio (might be blocked by browser autoplay policy, but we try)
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked:", e));
    }

    // Sequence of animations
    const timeouts = [
      setTimeout(() => setStage(1), 1000), // Show Mercury
      setTimeout(() => setStage(2), 2500), // Show CflatMinor
      setTimeout(() => setStage(3), 4000), // Start fade out
      setTimeout(() => {
        if (audioRef.current) {
           // Fade out audio
           let vol = 0.5;
           const fadeOut = setInterval(() => {
             if (vol > 0.05) {
               vol -= 0.05;
               audioRef.current!.volume = vol;
             } else {
               clearInterval(fadeOut);
               audioRef.current!.pause();
             }
           }, 100);
        }
        onComplete();
      }, 4500), 
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Optional intro audio (can be replaced by user) */}
        <audio ref={audioRef} src="/intro-riff.mp3" preload="auto" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
        
        {/* Animated grid lines for synthwave aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] animate-[grid-move_20s_linear_infinite]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {stage === 0 && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"
              />
            )}
            
            {stage === 1 && (
              <motion.div
                key="mercury"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  MERCURY
                </h2>
                <p className="text-zinc-400 mt-4 tracking-[0.5em] text-sm font-medium uppercase">Presents</p>
              </motion.div>
            )}

            {(stage === 2 || stage === 3) && (
              <motion.div
                key="cflatminor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_80px_rgba(168,85,247,0.5)] mb-8"
                >
                  <Music className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
                  CflatMinor
                </h1>
                <p className="text-xl text-purple-400 font-medium tracking-wide">
                  AI Audio Intelligence
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <style jsx global>{`
          @keyframes grid-move {
            0% { background-position: 0 0; }
            100% { background-position: 0 40px; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
