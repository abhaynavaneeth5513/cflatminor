"use client";

import { memo } from "react";
import Header from "@/app/components/header";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import Image from "next/image";
import { Award, MapPin, Music2, Calendar } from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const IMAGES = [
  "/mercury/band-stage-1.jpeg",
  "/mercury/band-stage-2.jpeg",
  "/mercury/band-stage-3.jpeg",
  "/mercury/band-stage-4.jpeg",
];

const STATS = [
  { icon: <Music2 className="w-5 h-5" />, label: "Genre", value: "Rock/Metal" },
  { icon: <MapPin className="w-5 h-5" />, label: "Base", value: "Bangalore" },
  { icon: <Calendar className="w-5 h-5" />, label: "Active Since", value: "2023" },
  { icon: <Award className="w-5 h-5" />, label: "Shows", value: "50+" },
];

// Pre-computed ember configs to avoid re-creation on every render
const EMBER_CONFIGS = Array.from({ length: 12 }, (_, i) => ({
  key: i,
  initialX: `${Math.random() * 100}%`,
  animateX: `${Math.random() * 100}%`,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * 2,
  scale: Math.random() * 1.5,
}));

const HighwayToHell = memo(function HighwayToHell() {
  return (
    <div className="container mx-auto px-4 mt-20 mb-10 relative z-10 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative py-16 overflow-hidden"
      >
        {/* Embers — reduced count, GPU-optimized */}
        <div className="absolute inset-0 pointer-events-none">
          {EMBER_CONFIGS.map((ember) => (
            <motion.div
              key={ember.key}
              initial={{ y: "100%", x: ember.initialX, opacity: 0, scale: ember.scale }}
              animate={{ y: "-20%", x: ember.animateX, opacity: [0, 1, 0] }}
              transition={{ duration: ember.duration, repeat: Infinity, delay: ember.delay, ease: "linear" }}
              className="absolute w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"
              style={{ willChange: "transform, opacity" }}
            />
          ))}
        </div>

        <div className="relative inline-block">
          <h2 
            className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-orange-700 via-red-500 to-yellow-300 drop-shadow-[0_0_50px_rgba(239,68,68,0.8)] relative z-10"
            style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.1)" }}
          >
            HIGHWAY TO HELL
          </h2>
          <div className="absolute inset-0 bg-gradient-to-t from-orange-700 via-red-500 to-yellow-300 blur-3xl opacity-30 animate-pulse z-0 mix-blend-screen" />
        </div>
      </motion.div>
    </div>
  );
});

export default function AboutMercury() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
      <Header />

      <main className="pt-32 pb-20 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

        <div className="container mx-auto px-4 mb-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-medium tracking-widest text-sm backdrop-blur-md">
              <Music2 className="w-4 h-4" /> LIVE ROCK & METAL
            </div>
            
            {/* Mercury Logo Image */}
            <div className="relative w-full max-w-[500px] aspect-[4/1] mb-8">
               <Image 
                 src="/logos/mercury-logo.jpeg" 
                 alt="Mercury" 
                 fill 
                 className="object-contain drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] mix-blend-screen"
                 priority
                 sizes="(max-width: 768px) 90vw, 500px"
               />
            </div>
            
            <p className="text-zinc-300 max-w-2xl mx-auto text-xl font-light tracking-wide mb-10 leading-relaxed">
              Rock n Roll band performing various covers from AC/DC, Guns N Roses, Metallica, System Of A Down and many more.
            </p>
            <a 
              href="https://instagram.com/mercury.band_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full font-bold text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <span>@mercury.band_</span>
            </a>
          </motion.div>
        </div>

        {/* HIGHWAY TO HELL */}
        <HighwayToHell />

        {/* Carousel Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative z-10"
        >
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="w-full max-w-[100vw] h-[50vh] md:h-[70vh] py-12"
          >
            {IMAGES.map((url, i) => (
              <SwiperSlide key={i} className="max-w-[85vw] md:max-w-[900px] h-full relative rounded-3xl overflow-hidden group border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <Image 
                  src={url} 
                  alt={`Live Moment ${i+1}`}
                  fill
                  className="object-cover transition-transform duration-[8s] ease-linear group-hover:scale-110"
                  sizes="(max-width: 768px) 85vw, 900px"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Info Grid Section */}
        <div className="container mx-auto px-4 mt-32 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-red-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(220,38,38,0.1)] group hover-ripple"
              >
                <div className="flex justify-center mb-6 text-red-500 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-black mb-2 tracking-tight">{stat.value}</div>
                <div className="text-zinc-500 text-sm uppercase tracking-widest font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gallery Grid Section */}
        <div className="container mx-auto px-4 mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMAGES.map((url, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 shadow-xl"
              >
                <Image 
                  src={url} 
                  alt={`Gallery Image ${i+1}`}
                  fill
                  className="object-cover transition-transform duration-[6s] ease-linear group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
