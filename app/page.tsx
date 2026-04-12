'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { UserProfileInput, PropertyInput, FinalLoanSummary } from '@/types';
import { calculateLoanSummary } from '@/lib/calculator';
import FinancialInput from '@/components/FinancialInput';
import HousingInput from '@/components/HousingInput';
import ResultCard from '@/components/ResultCard';
import { validateNumericFields } from '@/lib/validation';
import { Reveal } from '@/components/ui/Layout';
import { ScrollLitText } from '@/components/ui/ScrollLitText';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const defaultUserProfile: UserProfileInput = {
  myIncome: '',
  spouseIncome: '',
  cash: '',
  existingDebtPayment: '',
  age: '',
  isBirthdayPassed: false,
  jobType: 'employee',
  spouseJobType: 'employee',
  marriageStatus: 'single',
  isFirstTimeBuyer: false,
  isHomeless: true,
  newbornWithin2Years: false,
  childrenCount: '',
  wantsGraduatedRepayment: false,
  hasExistingFirstHomeLoan: false,
  hasUsedFirstTimeLoanBefore: false,
  existingFirstHomeLoanBalance: '',
  wantsNewbornRefinance: false,
  niceScore: '',
  kcbScore: '',
};

const defaultProperty: PropertyInput = {
  homePrice: '',
  kbPrice: '',
  exclusiveArea: '',
  isCapitalArea: true,
  isRegulatedArea: false,
};

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfileInput>(defaultUserProfile);
  const [property, setProperty] = useState<PropertyInput>(defaultProperty);
  const [result, setResult] = useState<FinalLoanSummary | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const resultRef = useRef<HTMLDivElement>(null);
  const checkerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.6], [0, 30]);

  const handleCalculate = () => {
    const errors = validateNumericFields([
      { label: '본인 연소득', value: userProfile.myIncome, required: true, min: 0 },
      { label: '보유 현금', value: userProfile.cash, required: true, min: 0 },
      { label: '나이', value: userProfile.age, required: true, min: 19, max: 120 },
      { label: '희망 매매가', value: property.homePrice, required: true, min: 1 },
      { label: '전용면적', value: property.exclusiveArea, required: true, min: 1 },
    ]);

    setValidationErrors(errors);
    if (errors.length > 0) return;

    const calculated = calculateLoanSummary(userProfile, property);
    setResult(calculated);
    
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

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

      {/* Main Analysis Engine Section */}
      <section ref={checkerRef} className="bg-[var(--secondary-bg)] py-48 md:py-80 px-6 relative overflow-hidden">
        {/* Designer Gradients */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[var(--primary)]/5 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--secondary)]/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
            <Reveal centered>
                <div className="text-center mb-40 space-y-8">
                    <h2 className="text-7xl md:text-[140px] font-black tracking-[-0.06em] leading-[0.85] text-[var(--secondary)]">Precision<br/>Profile.</h2>
                    <p className="text-xl md:text-3xl text-[var(--text-sub)] font-black tracking-tight max-w-2xl mx-auto opacity-70">
                        당신의 인생을 숫자로 정의하세요.<br/>나머지는 엔진이 책임집니다.
                    </p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
                {/* Profile Grid */}
                <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-24 md:gap-40">
                    <section className="relative">
                        <div className="absolute -left-20 -top-8 text-[120px] md:text-[240px] font-black text-gray-100/50 select-none -z-10 tracking-tighter opacity-70">01</div>
                        <FinancialInput data={userProfile} onChange={setUserProfile} />
                    </section>
                </div>

                {/* Property Module - Pulled Tight to Left */}
                <div className="xl:col-span-5 h-fit hidden xl:block sticky top-40">
                    <div className="flex flex-col gap-8">
                         <div className="flex items-center gap-4">
                            <CheckCircle2 className="w-7 h-7 text-[var(--primary)]" />
                            <h3 className="text-3xl font-black tracking-tighter leading-tight whitespace-nowrap overflow-visible">02 Property<br/>Intelligence</h3>
                         </div>
                         <div className="bg-white/60 backdrop-blur-3xl rounded-[4rem] p-10 md:p-14 shadow-[var(--apple-shadow)] border border-white/40">
                            <HousingInput data={property} onChange={setProperty} />
                         </div>
                    </div>
                </div>
            </div>
            
            {/* Logic Completion Button - Logical End of Flow */}
            <div className="mt-32 pt-32 border-t-2 border-dashed border-gray-100 flex flex-col items-center gap-12 text-center">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--secondary)]">모든 준비가 끝났습니다.</h3>
                    <p className="text-xl text-[var(--text-sub)] font-black">당신의 데이터를 기반으로 정밀 분석 리포트를 생성합니다.</p>
                 </div>
                 
                 <div className="w-full max-w-2xl">
                    <button
                        onClick={handleCalculate}
                        className="w-full premium-button premium-button-primary py-10 text-3xl font-black shadow-[0_40px_80px_rgba(48,213,200,0.4)] relative group overflow-hidden"
                    >
                        <span className="relative z-10">분석 리포트 생성하기</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                    
                    <AnimatePresence>
                        {validationErrors.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-10 bg-rose-50 border border-rose-100 rounded-[3rem] text-rose-600 text-left"
                            >
                                <p className="text-lg font-black mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-rose-600 rounded-full" /> 누락된 정보를 확인해주세요:
                                </p>
                                <ul className="text-sm space-y-2 font-black opacity-80 grid grid-cols-1 md:grid-cols-2">
                                    {validationErrors.map((err, i) => <li key={i} className="flex gap-2"><span>•</span> {err}</li>)}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
            </div>
        </div>
      </section>

      {/* Ultimate Results Section */}
      <AnimatePresence>
        {result && (
            <section ref={resultRef} className="relative z-30 bg-white rounded-[7rem] shadow-[0_-80px_160px_rgba(0,0,0,0.08)] mt-[-8rem] py-80">
                <div className="max-w-7xl mx-auto px-10">
                    <Reveal centered>
                        <div className="text-center mb-40 space-y-8">
                            <span className="text-[var(--primary)] font-black uppercase tracking-[0.6em] text-xs">Analysis Intelligence Result</span>
                            <h2 className="text-8xl md:text-[160px] font-black tracking-[-0.08em] leading-none mb-10">Report.</h2>
                            <div className="h-2 w-32 bg-[var(--primary)] mx-auto rounded-full" />
                        </div>
                    </Reveal>
                    <ResultCard result={result} />
                </div>
            </section>
        )}
      </AnimatePresence>

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
