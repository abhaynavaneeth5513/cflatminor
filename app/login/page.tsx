"use client";

import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Pre-computed waveform bar configs — 30 bars instead of 60
const WAVE_BARS = Array.from({ length: 30 }, (_, i) => ({
  key: i,
  duration: 1.5 + ((i * 7) % 10) * 0.1,
  delay: i * 0.06,
}));

const WaveformBg = memo(function WaveformBg() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen"
        style={{ willChange: "transform, opacity" }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen"
        style={{ willChange: "transform, opacity" }}
      />
      <div className="absolute inset-0 opacity-10 flex items-center justify-center">
        <div className="flex gap-2 h-40">
          {WAVE_BARS.map((bar) => (
            <motion.div
              key={bar.key}
              animate={{ height: ["10%", "100%", "10%"] }}
              transition={{ duration: bar.duration, repeat: Infinity, delay: bar.delay, ease: "easeInOut" }}
              className="w-1.5 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              style={{ willChange: "height" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  }, [email, password]);

  const togglePassword = useCallback(() => setShowPassword(v => !v), []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden selection:bg-purple-500/30">
      
      <WaveformBg />

      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80" prefetch>
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/10">
            <Image src="/logos/cflatmino-logo.jpeg" alt="CflatMinor" fill className="object-cover" sizes="48px" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">
            CflatMinor
          </span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-[450px] p-8 md:p-10 rounded-[2.5rem] bg-zinc-950/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden group mx-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex justify-center gap-4 mb-8">
           <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-white/10 bg-black">
              <Image src="/logos/cflatmino-logo.jpeg" alt="CflatMinor" fill className="object-cover" sizes="80px" />
           </div>
           <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.4)] border border-white/10 bg-black">
              <Image src="/logos/mercury-logo.jpeg" alt="Mercury" fill className="object-cover p-2" sizes="80px" />
           </div>
        </div>

        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-zinc-400 text-sm font-medium tracking-wide uppercase">Sign in to your audio intelligence</p>
        </div>

        <form className="space-y-5 mb-8 relative" onSubmit={handleSubmit}>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Successfully authenticated! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all duration-200 placeholder:text-zinc-600 shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center pr-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
              <Link href="/forgot-password" prefetch className="text-xs font-medium text-purple-400 hover:text-cyan-400 transition-colors">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all duration-200 placeholder:text-zinc-600 shadow-inner pr-12"
              />
              <button 
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors duration-150"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            disabled={isLoading || success}
            className="w-full relative py-4 rounded-2xl font-bold text-lg overflow-hidden group mt-6 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-transform duration-150"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 text-white flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </span>
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
            <span className="px-4 bg-zinc-950/60 text-zinc-500 backdrop-blur-sm">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative">
          <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <div className="mt-8 text-center text-zinc-500 text-sm relative">
          Don&apos;t have an account? <Link href="/register" prefetch className="text-purple-400 hover:text-cyan-400 transition-colors font-bold tracking-wide">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
}
