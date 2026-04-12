'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LoanDashboard from '@/components/LoanDashboard';
import { Reveal } from '@/components/ui/Layout';
import { ScrollLitText } from '@/components/ui/ScrollLitText';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const checkerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.6], [0, 30]);

  return (
    <div className="min-h-screen bg-white">
      {/* Precision Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-3xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <span className="text-3xl font-black text-[var(--secondary)] tracking-[-0.08em]">
                Jip<span className="gradient-text">Scout</span>
              </span>
              <div className="px-3 py-1 bg-[var(--accent)] rounded-lg text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">v.2.0 PRO</div>
          </div>
          <div className="hidden md:flex gap-16 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--secondary)]/40">
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Precision Engine</a>
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Architecture</a>
            <a href="#" className="hover:text-[var(--secondary)] transition-colors">Global Intelligence</a>
          </div>
          <button 
                onClick={() => checkerRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[var(--secondary)] text-white text-[10px] font-black px-10 py-3.5 rounded-full hover:shadow-[0_20px_40px_rgba(0,49,83,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Start Analyzing
          </button>
        </div>
      </nav>

      {/* Cinematic Hero Pro */}
      <section ref={heroRef} className="relative h-[120vh] w-full bg-black overflow-hidden flex flex-col items-center justify-center">
        <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity, filter: `blur(${heroBlur}px)` }}
            className="absolute inset-0 w-full h-full"
        >
            <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop" 
                alt="Architecture" 
                className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-white" />
        </motion.div>

        <div className="relative z-10 text-center space-y-16 px-6">
            <Reveal centered>
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full mb-12">
                   <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                   <span className="text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.4em]">Next Generation Analysis Engine</span>
                </div>
                <h1 className="hero-text text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    세상에서 가장<br/>
                    <span className="gradient-text">아름다운 한도 판정.</span>
                </h1>
                <p className="text-white/60 text-lg md:text-3xl mt-12 max-w-3xl mx-auto font-black tracking-tight leading-snug">
                    단순한 계산기가 아닙니다. 당신의 인생 데이터를<br/>
                    예술적인 숫자로 변형하는 정밀 알고리즘입니다.
                </p>
                <div className="mt-20">
                    <button 
                        onClick={() => checkerRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-[var(--secondary)] text-2xl font-black px-20 py-8 rounded-[2rem] shadow-[0_40px_100px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all group"
                    >
                        지금 엔진 가동하기 <ArrowRight className="inline-block ml-4 group-hover:translate-x-3 transition-transform" />
                    </button>
                </div>
            </Reveal>
        </div>
      </section>

      {/* Pro Narrative Scroll */}
      <ScrollLitText 
        text="누구도 흉내 낼 수 없는 디테일." 
        subtext="애플의 철학을 담은 인터랙티브 타일과 루사이드 벡터 시스템이 당신의 입력을 예술적인 경험으로 바꿉니다."
      />

      {/* Interactive Loan Dashboard - THE main feature */}
      <section ref={checkerRef} id="detailed-analysis" className="bg-[var(--secondary-bg)] py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[var(--primary)]/5 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--secondary)]/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />

        <Reveal centered>
          <div className="text-center mb-20 space-y-6 relative z-10">
            <span className="text-[var(--primary)] font-black uppercase tracking-[0.5em] text-xs">Real-time Financial Playground</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-[var(--secondary)]">Interactive<br/>Dashboard.</h2>
            <p className="text-xl text-gray-400 font-black tracking-tight max-w-2xl mx-auto">슬라이더를 움직여보세요. 당신의 미래가 실시간으로 바뀝니다.</p>
          </div>
        </Reveal>

        <div className="relative z-10">
          <LoanDashboard />
        </div>
      </section>

      <ScrollLitText 
        text="우리는 매물 그 이상을 봅니다." 
        subtext="당신에게 딱 맞는 수도권 아파트를 실시간 실거래가 분석으로 곧 추천해 드릴 예정입니다."
      />

      {/* Pro Footer */}
      <footer className="bg-white pt-80 pb-32 px-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-24">
            <span className="text-7xl font-black text-[var(--secondary)] tracking-[-0.1em]">
                Jip<span className="gradient-text">Scout</span>.
            </span>
            <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">
                <a href="#" className="hover:text-[var(--secondary)] transition-colors">Engineering</a>
                <a href="#" className="hover:text-[var(--secondary)] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[var(--secondary)] transition-colors">Institutional</a>
                <a href="#" className="hover:text-[var(--secondary)] transition-colors">© 2026 PRECISION</a>
            </div>
            <p className="text-[10px] text-gray-200 font-black max-w-lg mx-auto leading-loose uppercase tracking-widest px-10">
                Designed for the next generation of home buyers. Verified by the state-of-the-art loan calculation engine.
            </p>
        </div>
      </footer>
    </div>
  );
}
