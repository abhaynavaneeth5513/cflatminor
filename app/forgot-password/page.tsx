"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Animated Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen"
        />
        
        {/* Waveform graphic overlay */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <div className="flex gap-2 h-40">
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ["10%", "100%", "10%"] }}
                transition={{ duration: 1.5 + ((i * 7) % 10) * 0.1, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                className="w-1.5 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/10">
            <Image src="/logos/cflatmino-logo.jpeg" alt="CflatMinor" fill className="object-cover" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">
            CflatMinor
          </span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[450px] p-8 md:p-10 rounded-[2.5rem] bg-zinc-950/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative flex justify-center gap-4 mb-8">
           <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-white/10 bg-black">
              <Image src="/logos/cflatmino-logo.jpeg" alt="CflatMinor" fill className="object-cover" />
           </div>
        </div>

        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3 tracking-tight">Reset Password</h1>
          <p className="text-zinc-400 text-sm font-medium tracking-wide">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form className="space-y-5 mb-8 relative" onSubmit={handleSubmit}>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
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
                className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-start gap-2 text-sm font-medium"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Check your email for a reset link. If it exists, you will receive an email shortly.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all placeholder:text-zinc-600 shadow-inner"
                />
              </div>

              <button 
                disabled={isLoading}
                className="w-full relative py-4 rounded-2xl font-bold text-lg overflow-hidden group mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 text-white flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </>
          )}

          {success && (
            <Link 
              href="/login"
              className="w-full flex items-center justify-center py-4 rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/5 transition-colors"
            >
              Return to Login
            </Link>
          )}
        </form>

        <div className="mt-8 text-center text-zinc-500 text-sm relative">
          Remember your password? <Link href="/login" className="text-purple-400 hover:text-cyan-400 transition-colors font-bold tracking-wide">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
}
