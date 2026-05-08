"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LINKS = [
  { name: "Analyzer", href: "/" },
  { name: "Live Recognition", href: "/live" },
  { name: "Mercury Band", href: "/about/mercury" },
  { name: "About Dev", href: "/about/developer" },
] as const;

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2" 
          : "bg-transparent py-4"
      }`}
      style={{ willChange: "background-color, padding" }}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" prefetch>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-white/20 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-shadow"
          >
            <Image src="/logos/cflatmino-logo.jpeg" alt="CflatMinor" fill className="object-cover" sizes="40px" />
          </motion.div>
          <span className="font-black text-xl tracking-tighter text-white drop-shadow-md">
            CflatMinor
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch
              className="relative text-sm font-semibold text-zinc-300 hover:text-white transition-colors group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/login" prefetch className="text-sm font-bold text-zinc-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">
            Log in
          </Link>
          <Link href="/register" prefetch className="relative overflow-hidden group bg-white text-black hover:bg-white rounded-full px-7 py-2 font-bold transition-transform duration-200 hover:scale-105 inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Sign up</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2 relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
            >
              <nav className="flex flex-col items-center gap-8 w-full px-6">
                {LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 hover:from-purple-400 hover:to-cyan-400 transition-all tracking-tight"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: LINKS.length * 0.08 }}
                  className="w-full h-px bg-white/10 my-4" 
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (LINKS.length + 1) * 0.08 }}
                  className="flex flex-col gap-4 w-full max-w-xs"
                >
                  <Link 
                    href="/login" 
                    onClick={closeMobile}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-center font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/register"
                    onClick={closeMobile}
                    className="w-full flex items-center justify-center py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                  >
                    Sign up
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default memo(Header);
