"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * IntroScreen — Cinematic 3-second startup sequence.
 * 
 * Performance optimizations:
 * - Preloads all images via priority prop
 * - Uses GPU-accelerated transforms only (translate, scale, opacity)
 * - Avoids filter animations (no blur transitions in the hot path)
 * - useCallback for onComplete to prevent re-mounts
 * - Tight 3-second timeline for snappy UX
 */

const BAND_IMAGES = [
  "/mercury/band-stage-1.jpeg",
  "/mercury/band-stage-2.jpeg",
  "/mercury/band-stage-3.jpeg",
  "/mercury/band-stage-4.jpeg",
];

function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  const stableComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Tight 3-second intro timeline
    const timers = [
      setTimeout(() => setStage(1), 200),    // Band images start
      setTimeout(() => setStage(2), 800),     // Mercury logo
      setTimeout(() => setStage(3), 1800),    // CflatMinor logo
      setTimeout(() => setStage(4), 2800),    // Fade out
      setTimeout(() => stableComplete(), 3200), // Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, [stableComplete]);

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Preload all band images (hidden but loaded) */}
          <div className="hidden">
            {BAND_IMAGES.map((src) => (
              <Image key={src} src={src} alt="" width={1} height={1} priority />
            ))}
          </div>

          {/* Cinematic Background — Ken Burns zoom on crossfading images */}
          <div className="absolute inset-0">
            {BAND_IMAGES.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: stage >= 1 ? [0, 0.4, 0.4, 0][Math.min(i, 3)] === undefined ? 0 : (stage === 1 && i === 0 ? 0.5 : stage === 2 && i === 1 ? 0.4 : stage === 3 && i === 2 ? 0.3 : 0) : 0,
                  scale: stage >= 1 ? 1.05 : 1,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0"
                style={{ willChange: "opacity, transform" }}
              >
                <Image src={src} alt="" fill className="object-cover" priority sizes="100vw" />
              </motion.div>
            ))}
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-[1]" />

          {/* Ambient glow — GPU-friendly, no re-renders */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen z-[2]"
          >
            <div className="w-[50vw] h-[50vw] rounded-full bg-purple-600/15 blur-[80px] animate-pulse" />
          </div>

          {/* Foreground logos */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
            <AnimatePresence mode="wait">
              {stage === 2 && (
                <motion.div
                  key="mercury-logo"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="text-xs text-purple-400 tracking-[0.3em] mb-6 font-semibold uppercase">Presented by</div>
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.3)] border border-white/10">
                    <Image src="/logos/mercury-logo.jpeg" alt="Mercury Logo" fill className="object-cover" priority sizes="256px" />
                  </div>
                  {/* Mini equalizer */}
                  <div className="mt-6 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ["8px", "32px", "8px"] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.08 }}
                        className="w-1 bg-white/60 rounded-full"
                        style={{ willChange: "height" }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {stage === 3 && (
                <motion.div
                  key="cflatminor-logo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.3)] border border-white/10 mb-6">
                    <Image src="/logos/cflatmino-logo.jpeg" alt="CflatMinor Logo" fill className="object-cover" priority sizes="256px" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-2xl">
                    CflatMinor
                  </h2>
                  <p className="mt-3 text-base text-cyan-400 font-medium tracking-[0.2em] uppercase">
                    AI Audio Intelligence
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(IntroScreen);
