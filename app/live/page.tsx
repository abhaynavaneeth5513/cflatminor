"use client";

import Header from "@/app/components/header";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { memo } from "react";

function LiveRecognition() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen pt-20 px-4 relative overflow-hidden">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center space-y-6 max-w-xl z-10"
        >
          <div className="w-24 h-24 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-12px_rgba(236,72,153,0.5)] glow-pulse">
            <Mic className="w-10 h-10 text-pink-400" />
          </div>
          
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Live Recognition
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            Listen to any playing audio from your microphone and get instant AI breakdown in real-time.
          </p>

          <div className="pt-8">
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-white/10 group active:scale-95 transition-transform duration-150">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-ping" />
                Start Listening
              </span>
            </Button>
          </div>
          
          <div className="mt-12 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Coming Soon</p>
            <p className="text-zinc-400 text-sm mt-1">This feature requires advanced WebAudio API permissions and is currently in beta.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default memo(LiveRecognition);
