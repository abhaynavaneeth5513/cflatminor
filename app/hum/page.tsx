"use client";

import Header from "@/app/components/header";
import { AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { memo } from "react";

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  );
}

function HumSearch() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen pt-20 px-4 relative overflow-hidden">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center space-y-6 max-w-xl z-10"
        >
          <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] glow-pulse">
            <AudioWaveform className="w-10 h-10 text-blue-400" />
          </div>
          
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Hum Search
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            Got a melody stuck in your head? Just hum it, and our AI will find the song and analyze its core progression.
          </p>

          <div className="pt-8">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-blue-600/20 group active:scale-95 transition-transform duration-150">
              <span className="flex items-center gap-2">
                <MicIcon />
                Hum to Search
              </span>
            </Button>
          </div>
          
          <div className="mt-12 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Coming Soon</p>
            <p className="text-zinc-400 text-sm mt-1">Our humming-to-MIDI neural network is currently training.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default memo(HumSearch);
