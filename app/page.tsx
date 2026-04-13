'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.6], [0, 30]);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-3xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-3xl font-black text-[var(--secondary)] tracking-[-0.08em]">
              Jip<span className="gradient-text">Scout</span>
            </span>
            <div className="px-3 py-1 bg-[var(--accent)] rounded-lg text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">v3.0</div>
          </div>
          <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]/40">
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Precision Engine</a>
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Architecture</a>
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Global Intelligence</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/calculator" className="hidden sm:block bg-black text-white text-[10px] font-black px-8 py-3.5 rounded-full hover:bg-gray-800 transition-all">
              Start Analyzing
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Cinematic Hero */}
      <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, filter: `blur(${heroBlur}px)` }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
            alt="Architecture"
            className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/60" />
        </motion.div>

        <div className="relative z-10 text-center px-6 space-y-10">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.4em]">Next Generation Analysis Engine</span>
          </div>

          <h1 className="hero-text text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            세상에서 가장<br />
            <span className="gradient-text">아름다운 한도 판정.</span>
          </h1>

          <p className="text-white/60 text-lg md:text-2xl max-w-3xl mx-auto font-black tracking-tight leading-snug">
            단순한 계산기가 아닙니다. 당신의 인생 데이터를<br />
            예술적인 숫자로 변형하는 정밀 알고리즘입니다.
          </p>

          <Link
            href="/calculator"
            className="inline-block bg-white text-[var(--secondary)] text-2xl font-black px-20 py-8 rounded-[2rem] shadow-[0_40px_100px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all group"
          >
            지금 엔진 가동하기 <ArrowRight className="inline-block ml-4 group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-40 pb-24 px-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-16">
          <span className="text-7xl font-black text-[var(--secondary)] tracking-[-0.1em]">
            Jip<span className="gradient-text">Scout</span>.
          </span>
          <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Engineering</a>
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Institutional</a>
            <span>© 2026 PRECISION</span>
          </div>
          <p className="text-[10px] text-gray-200 font-black max-w-lg mx-auto leading-loose uppercase tracking-widest px-10">
            Designed for the next generation of home buyers. Powered by a state-of-the-art loan calculation engine.
          </p>
        </div>
      </footer>
    </div>
  );
}
