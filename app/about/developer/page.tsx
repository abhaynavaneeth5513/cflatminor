"use client";

import Header from "@/app/components/header";
import { motion } from "framer-motion";
import { Code, Music, Cpu, Mic2, Star, Mail } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

const SKILLS = [
  { name: "Audio Intelligence", icon: <Mic2 className="w-4 h-4" /> },
  { name: "DSP", icon: <Cpu className="w-4 h-4" /> },
  { name: "Music AI", icon: <Music className="w-4 h-4" /> },
  { name: "Live Performance", icon: <Star className="w-4 h-4" /> },
  { name: "Full-Stack Dev", icon: <Code className="w-4 h-4" /> },
];

function AboutDeveloper() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Header />

      <main className="pt-32 pb-20 px-4 relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Cinematic Background effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        <div className="container max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-center">
            
            {/* Left Col - Animated Profile Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.2)] group transition-all duration-500 hover:shadow-[0_0_80px_rgba(168,85,247,0.4)] hover:-translate-y-2">
                {/* Creator Image */}
                <div className="w-full h-full relative">
                  <Image 
                    src="/creator/abhay-navaneeth.jpeg" 
                    alt="Abhay Navaneeth" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 90vw, 400px"
                  />
                  <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col gap-4 z-10">
                  <a 
                    href="https://instagram.com/mr_abhaynavaneeth" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl font-bold text-white shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>@mr_abhaynavaneeth</span>
                  </a>
                  <a 
                    href="mailto:abhaynavaneeth@gmail.com" 
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Mail className="w-6 h-6" />
                    <span>Email Me</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Col - Bio */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
                Abhay <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg">Navaneeth</span>
              </h1>
              
              <div className="inline-block px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 font-medium tracking-widest text-sm uppercase mb-8 backdrop-blur-md">
                Creator of CflatMinor • Keyboardist
              </div>

              <div className="space-y-6 text-zinc-300 text-xl leading-relaxed mb-10 font-light">
                <p>
                  Engineering student and passionate technologist bridging the gap between artificial intelligence and musical expression.
                </p>
                <p>
                  As an active keyboardist in the band <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 font-bold tracking-widest uppercase">Mercury</span>, I've experienced firsthand the intricate nuances of live music performance. This deep understanding of music theory and audio dynamics inspired the creation of <span className="text-white font-semibold">CflatMinor</span>.
                </p>
              </div>

              {/* Skills/Interests tags */}
              <div className="flex flex-wrap gap-4">
                {SKILLS.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex items-center gap-2 px-5 py-3 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl text-sm font-medium hover:border-purple-500/50 hover:bg-purple-500/10 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] transition-all duration-200 cursor-default"
                  >
                    <span className="text-cyan-400">{skill.icon}</span>
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(AboutDeveloper);
