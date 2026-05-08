"use client";

import { useState, useCallback, useMemo, memo } from "react";
import Header from "@/app/components/header";
import FileUpload from "@/app/components/file-upload";
import AnalysisResults from "@/app/components/analysis-results";
import IntroScreen from "@/app/components/intro-screen";
import { motion, AnimatePresence } from "framer-motion";
import {
  analyzeAudio,
  isApiError,
  type AnalysisResult,
} from "@/app/lib/api";
import { Badge } from "@/components/ui/badge";

// Pre-compute equalizer bar animation configs to avoid re-creation on every render
const EQUALIZER_BARS = Array.from({ length: 12 }, (_, i) => ({
  key: i,
  duration: 1.2 + (i * 0.12),
  delay: i * 0.04,
}));

const EqualizerVisual = memo(function EqualizerVisual() {
  return (
    <div className="flex justify-center items-end gap-1.5 h-16 mt-10">
      {EQUALIZER_BARS.map((bar) => (
        <motion.div
          key={bar.key}
          animate={{ height: ["20%", "100%", "20%"] }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            delay: bar.delay,
            ease: "easeInOut",
          }}
          className="w-2 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t-full shadow-[0_0_8px_rgba(168,85,247,0.3)]"
          style={{ willChange: "height" }}
        />
      ))}
    </div>
  );
});

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setProgress("");
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setProgress("Uploading file...");

    try {
      await new Promise((r) => setTimeout(r, 300));
      setProgress("Analyzing audio — this may take 1-3 minutes...");

      const response = await analyzeAudio(selectedFile);

      if (isApiError(response)) {
        setError(response.error);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
      setProgress("");
    }
  }, [selectedFile]);

  const handleIntroComplete = useCallback(() => setShowIntro(false), []);
  const handleReset = useCallback(() => { setResult(null); setSelectedFile(null); }, []);

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-purple-500/30 overflow-hidden">
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      <Header />
      
      {/* Immersive Animated Background — GPU accelerated */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ willChange: "transform" }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[150px] mix-blend-screen"
          style={{ willChange: "transform, opacity" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen"
          style={{ willChange: "transform, opacity" }}
        />
      </div>

      <main className="flex-1 flex flex-col pt-24 px-4 pb-20 relative z-10 min-h-screen">
        
        <div className="container max-w-6xl mx-auto flex flex-col items-center justify-center flex-1">
          
          {/* Animated Hero Section */}
          <AnimatePresence mode="wait">
            {!result && (
              <motion.div 
                key="hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center space-y-8 mb-16 w-full"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <Badge variant="outline" className="px-5 py-2 border-purple-500/40 bg-purple-500/10 text-purple-300 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)] tracking-wide">
                    ✨ The Next Generation of Audio Analysis
                  </Badge>
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
                  Discover the <br className="md:hidden" />
                  <span className="relative inline-block">
                    <span className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-500 blur-2xl opacity-40 animate-pulse"></span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                      DNA
                    </span>
                  </span> of any song.
                </h1>
                
                <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light tracking-wide leading-relaxed">
                  Upload your tracks and let our AI instantly break down instruments, BPM, key, structure, and advanced audio features.
                </p>

                {/* Optimized Equalizer Visual — memoized, fewer bars */}
                <EqualizerVisual />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main App Container */}
          <motion.div 
            layout
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={`w-full ${result ? 'max-w-5xl' : 'max-w-2xl'} relative`}
          >
            
            {/* Upload Box */}
            <AnimatePresence mode="wait">
              {!result && (
                <motion.div 
                  key="upload"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative bg-zinc-950/80 p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-2xl hover-ripple">
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFile={selectedFile}
                      disabled={loading}
                    />

                    <button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || loading}
                      className="w-full mt-8 py-5 rounded-2xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                          {progress}
                        </span>
                      ) : (
                        "Analyze Track"
                      )}
                    </button>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                      >
                        <p className="text-red-400 text-sm font-bold text-center tracking-wide">
                          {error}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && !result && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-10 space-y-6 w-full"
              >
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "transform" }}
                  />
                </div>
                {/* Skeleton shimmer */}
                <div className="h-80 w-full bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                </div>
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
              {result && !loading && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Analysis Complete</h2>
                    <button 
                      onClick={handleReset}
                      className="px-6 py-3 text-sm font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95"
                    >
                      Analyze Another Track
                    </button>
                  </div>
                  <div className="p-[1px] rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent">
                    <div className="bg-zinc-950/90 rounded-[2rem] backdrop-blur-2xl">
                      <AnalysisResults result={result} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}