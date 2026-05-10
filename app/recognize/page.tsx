"use client";

import Header from "@/app/components/header";
import { Mic, UploadCloud, Search, Music } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { memo, useState, useCallback } from "react";
import FileUpload from "@/app/components/file-upload";

function RecognizePage() {
  const [mode, setMode] = useState<"select" | "mic" | "upload" | "analyzing" | "result">("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleSimulatedRecognition = useCallback(() => {
    setMode("analyzing");
    setTimeout(() => {
      setMode("result");
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen pt-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

        <div className="container max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-medium tracking-widest text-sm backdrop-blur-md">
              <Search className="w-4 h-4" /> AUDIO RECOGNITION
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl mb-4">
              Identify any <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Song</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Powered by ACRCloud & AudD architectures for lightning-fast audio fingerprinting.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {mode === "select" && (
              <motion.div 
                key="select"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid md:grid-cols-2 gap-6 w-full max-w-2xl"
              >
                <div 
                  onClick={() => setMode("mic")}
                  className="group relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:border-blue-500/50 hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]">
                    <Mic className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Listen</h3>
                  <p className="text-zinc-400 text-sm">Identify playing music</p>
                </div>

                <div 
                  onClick={() => setMode("upload")}
                  className="group relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                    <UploadCloud className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Upload</h3>
                  <p className="text-zinc-400 text-sm">Recognize from file</p>
                </div>
              </motion.div>
            )}

            {mode === "mic" && (
              <motion.div
                key="mic"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl text-center"
              >
                <div className="relative w-40 h-40 mx-auto mb-12">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping blur-md" />
                  <div className="absolute inset-4 bg-blue-500/40 rounded-full animate-pulse" />
                  <div className="relative w-full h-full bg-zinc-900 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.6)] cursor-pointer" onClick={handleSimulatedRecognition}>
                    <Mic className="w-16 h-16 text-blue-400" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Listening...</h2>
                <p className="text-zinc-400">Make sure your microphone is close to the audio source.</p>
                <button onClick={() => setMode("select")} className="mt-8 text-zinc-500 hover:text-white transition-colors">Cancel</button>
              </motion.div>
            )}

            {mode === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl"
              >
                <div className="bg-zinc-900/80 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <FileUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setMode("select")} className="flex-1 py-4 rounded-xl font-bold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">Back</button>
                    <button 
                      disabled={!selectedFile}
                      onClick={handleSimulatedRecognition} 
                      className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                    >
                      Recognize
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xl text-center space-y-8"
              >
                <div className="h-32 flex items-center justify-center gap-2">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["20%", "100%", "20%"] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-3 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                    />
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-white">Generating Audio Fingerprint...</h2>
                <p className="text-zinc-400">Querying ACRCloud & AudD databases</p>
              </motion.div>
            )}

            {mode === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
              >
                <div className="bg-zinc-900/80 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-48 h-48 bg-zinc-800 rounded-2xl border border-white/5 flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden">
                    {/* Placeholder for artwork */}
                    <Music className="w-16 h-16 text-zinc-600 absolute" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 mix-blend-overlay" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2">Match Found</div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Stairway to Heaven</h2>
                    <h3 className="text-2xl text-zinc-300 font-medium mb-4">Led Zeppelin</h3>
                    <div className="flex flex-col gap-2 text-sm text-zinc-500 mb-6">
                      <p>Album: Led Zeppelin IV</p>
                      <p>Release: 1971</p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button className="px-6 py-3 rounded-full bg-[#1DB954] text-black font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(29,185,84,0.3)]">Spotify</button>
                      <button className="px-6 py-3 rounded-full bg-[#FA243C] text-white font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(250,36,60,0.3)]">Apple Music</button>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <button onClick={() => { setMode("select"); setSelectedFile(null); }} className="text-zinc-500 hover:text-white transition-colors font-medium">Identify Another Song</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default memo(RecognizePage);
