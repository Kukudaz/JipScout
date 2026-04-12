'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { UserProfileInput, PropertyInput, FinalLoanSummary } from '@/types';
import { calculateLoanSummary } from '@/lib/calculator';
import FinancialInput from '@/components/FinancialInput';
import HousingInput from '@/components/HousingInput';
import ResultCard from '@/components/ResultCard';
import { validateNumericFields } from '@/lib/validation';
import { PremiumCard, SectionTitle, Reveal } from '@/components/ui/Layout';
import { ScrollLitText } from '@/components/ui/ScrollLitText';

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

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.5], [0, 20]);

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
    <div className="min-h-screen bg-white selection:bg-[var(--primary)] selection:text-white">
      {/* Dynamic Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-black text-[var(--secondary)] tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            Jip<span className="text-[var(--primary)]">Scout</span>
          </span>
          <div className="hidden md:flex gap-14 text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">
            <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Intelligence</a>
            <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Matching</a>
            <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Global Policy</a>
          </div>
          <button 
                onClick={() => checkerRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[var(--secondary)] text-white text-[10px] font-black px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Start Engine
          </button>
        </div>
      </nav>

      {/* Cinematic Hero - Apple Pro Style */}
      <section ref={heroRef} className="relative h-[110vh] w-full bg-black overflow-hidden flex flex-col items-center justify-center">
        <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity, filter: `blur(${heroBlur}px)` }}
            className="absolute inset-0 w-full h-full"
        >
            <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop" 
                alt="Luxury Home Interior" 
                className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white" />
        </motion.div>

        <div className="relative z-10 text-center space-y-10 px-6">
            <Reveal>
                <motion.span 
                    initial={{ letterSpacing: '0.2em', opacity: 0 }}
                    animate={{ letterSpacing: '0.5em', opacity: 1 }}
                    className="block text-[var(--primary)] text-xs font-black uppercase tracking-[0.5em] mb-8"
                >
                    Premium Real Estate Intelligence
                </motion.span>
                <h1 className="hero-text text-white drop-shadow-2xl">
                    집을 찾기 전,<br/>
                    나의 <span className="text-[var(--primary)]">진짜 한도</span>부터.
                </h1>
                <p className="text-white/70 text-lg md:text-2xl mt-12 max-w-2xl mx-auto font-bold leading-relaxed">
                    2026년 최신 금융 정책을 반영한 초정밀 대출 판정 엔진.<br/>
                    당신과 배우자의 모든 조건을 데이터로 증명합니다.
                </p>
                <div className="mt-20 flex flex-col md:flex-row gap-6 justify-center items-center">
                    <button 
                        onClick={() => checkerRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-[var(--secondary)] text-xl font-black px-16 py-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
                    >
                        지금 분석 시작하기
                    </button>
                </div>
            </Reveal>
        </div>
      </section>

      {/* Cinematic Narrative Spacing */}
      <ScrollLitText 
        text="디테일이 만드는 압도적 차이." 
        subtext="단순한 계산기가 아닙니다. 배우자의 직업 유형부터 자녀 수, 생애최초 여부까지 모든 변수를 입체적으로 분석합니다."
      />

      {/* Checker Module */}
      <section ref={checkerRef} className="bg-[var(--secondary-bg)] py-40 md:py-64 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--primary)]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
            <Reveal centered>
                <div className="text-center mb-32 space-y-6">
                    <h2 className="text-6xl md:text-[100px] font-black tracking-tighter leading-none">데이터 프로필.</h2>
                    <p className="text-xl md:text-2xl text-[var(--text-sub)] font-bold max-w-2xl mx-auto">
                        한도 판정에 필요한 당신의 재무 상태를 빠짐없이 들려주세요.
                    </p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                <div className="lg:col-span-8 space-y-32">
                    <section className="relative">
                        <div className="absolute -left-20 top-0 text-[180px] font-black text-gray-100/50 select-none -z-10 tracking-tighter">01</div>
                        <FinancialInput data={userProfile} onChange={setUserProfile} />
                    </section>
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                    <div className="bg-white rounded-[4rem] p-12 shadow-[var(--apple-shadow)] border border-gray-100 flex flex-col gap-12">
                         <div className="space-y-6">
                            <h3 className="text-2xl font-black tracking-tighter">02 주택 정보</h3>
                            <HousingInput data={property} onChange={setProperty} />
                         </div>

                         <div className="pt-8 border-t border-gray-100 space-y-6">
                            <button
                                onClick={handleCalculate}
                                className="w-full premium-button premium-button-primary py-8 text-2xl font-black shadow-[0_30px_70px_rgba(48,213,200,0.3)]"
                            >
                                분석 결과 확인
                            </button>
                            
                            <AnimatePresence>
                                {validationErrors.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] text-rose-600 space-y-4"
                                    >
                                        <p className="text-sm font-black">정보를 완성해주세요:</p>
                                        <ul className="text-xs space-y-1 opacity-80 font-bold">
                                            {validationErrors.map((err, i) => <li key={i}>• {err}</li>)}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Result Module */}
      <AnimatePresence>
        {result && (
            <section ref={resultRef} className="relative z-30 bg-white rounded-[6rem] shadow-[0_-50px_100px_rgba(0,0,0,0.05)] mt-[-6rem] py-64">
                <div className="max-w-6xl mx-auto px-6">
                    <Reveal centered>
                        <div className="text-center mb-32 space-y-4">
                            <span className="text-[var(--primary)] font-black uppercase tracking-[0.5em] text-xs">Analysis Complete</span>
                            <h2 className="text-7xl md:text-[120px] font-black tracking-tighter">정밀 분석서.</h2>
                        </div>
                    </Reveal>
                    <ResultCard result={result} />
                </div>
            </section>
        )}
      </AnimatePresence>

      <ScrollLitText 
        text="당신의 예산, 매물이 됩니다." 
        subtext="산출된 한도에 딱 맞는 수도권 핵심 단지들을 실시간 실거래가 기반으로 곧 매칭해 드릴 예정입니다."
      />

      {/* Mockup Callout Section */}
      <section className="section-container">
          <div className="bg-[var(--secondary)] rounded-[5rem] p-12 md:p-32 flex flex-col md:flex-row items-center gap-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                 <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" />
             </div>
             
             <div className="flex-1 space-y-12 relative z-10">
                <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                   매물 상권 분석까지<br/>
                   <span className="text-[var(--primary)]">한 번에.</span>
                </h2>
                <p className="text-white/60 text-xl md:text-2xl font-bold max-w-xl">
                    단순한 아파트 정보를 넘어 대출 가능여부와 주변 실거래가, 그리고 미래 가치를 종합한 커스텀 지도를 제공합니다.
                </p>
                <div className="flex flex-wrap gap-4">
                   <div className="px-10 py-5 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/10 text-[var(--primary)] font-black uppercase tracking-widest text-xs">
                        Coming Early 2026
                   </div>
                </div>
             </div>
             
             <div className="flex-1 w-full max-w-lg aspect-auto">
                 <div className="bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-4 aspect-[4/5] flex items-center justify-center relative shadow-2xl">
                    <span className="text-white/10 font-black text-9xl select-none">MOCK</span>
                 </div>
             </div>
          </div>
      </section>

      {/* Pro Footer */}
      <footer className="bg-white py-60 px-10 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-16">
            <span className="text-6xl font-black text-[var(--secondary)] tracking-tighter">
                Jip<span className="text-[var(--primary)]">Scout</span>.
            </span>
            <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                <a href="#">Technology</a>
                <a href="#">Safety & Privacy</a>
                <a href="#">Institutional Support</a>
                <a href="#">Contact</a>
            </div>
            <div className="h-[2px] w-20 bg-[var(--primary)] mb-8" />
            <p className="text-[10px] text-gray-300 font-bold max-w-md mx-auto leading-loose">
                본 서비스는 금융감독원의 규제 가이드와 최신 대출 정책을 알고리즘화한 예상치이며, 실제 대출 승인 및 한도는 개별 금융기관의 최종 심사에 따라 달라질 수 있습니다.
            </p>
        </div>
      </footer>
    </div>
  );
}
