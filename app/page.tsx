'use client';

import { useState, useRef, useEffect } from 'react';
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

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const validateInputs = (): string[] => {
    return validateNumericFields([
      { label: '본인 연소득', value: userProfile.myIncome, required: true, min: 0 },
      { label: '보유 현금', value: userProfile.cash, required: true, min: 0 },
      { label: '나이', value: userProfile.age, required: true, min: 19, max: 120 },
      { label: '희망 매매가', value: property.homePrice, required: true, min: 1 },
      { label: '전용면적', value: property.exclusiveArea, required: true, min: 1 },
    ]);
  };

  const handleCalculate = () => {
    const errors = validateInputs();
    setValidationErrors(errors);
    if (errors.length > 0) return;

    const calculated = calculateLoanSummary(userProfile, property);
    setResult(calculated);
    
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black text-[var(--secondary)] tracking-tighter">
            Jip<span className="text-[var(--primary)]">Scout</span>
          </span>
          <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]/60">
            <a href="#" className="hover:text-[var(--primary)]">Engine</a>
            <a href="#" className="hover:text-[var(--primary)]">Comparison</a>
            <a href="#" className="hover:text-[var(--primary)]">Policies</a>
          </div>
          <button 
            onClick={() => checkerRef.current?.scrollIntoView({ behavior: 'smooth' })} 
            className="bg-[var(--secondary)] text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-full hover:scale-105 transition-transform"
          >
            Calculate
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
        <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="absolute inset-0 w-full h-full"
        >
            <img 
                src="/hero.png" 
                alt="Premium Home" 
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
            <Reveal>
              <span className="text-[var(--primary)] font-black uppercase tracking-[0.3em] text-xs mb-8 block">Project JipScout 2026</span>
              <h1 className="hero-text text-white drop-shadow-2xl">
                집을 찾기 전,<br/>
                나의 <span className="text-[var(--primary)]">진짜 예산</span>부터.
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-white/80 text-lg md:text-2xl mt-12 max-w-2xl mx-auto font-medium"
              >
                가장 정밀한 알고리즘이 당신의 재무 상태와<br/>국가 정책을 분석하여 한도를 결정합니다.
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                onClick={() => checkerRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-16 bg-white text-[var(--secondary)] font-black px-12 py-5 rounded-full text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                한도 정밀 분석 시작하기
              </motion.button>
            </Reveal>
        </div>
      </section>

      {/* Cinematic Narrative */}
      <ScrollLitText 
        text="당신과 배우자, 모두의 조건을 담다." 
        subtext="놓치기 쉬운 배우자의 소득과 직업 형태까지 완벽하게 반영하여 최적의 대출 시나리오를 설계합니다."
      />

      {/* Main Form Section */}
      <section ref={checkerRef} className="bg-[var(--secondary-bg)] py-32 md:py-60 px-6">
        <div className="max-w-7xl mx-auto">
            <Reveal>
                <div className="mb-24 text-center">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">금융 프로필</h2>
                    <p className="text-xl text-[var(--text-sub)] font-medium">당신의 조건을 하나도 빠짐없이 입력해주세요.</p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-24 items-start">
               {/* Left: Financial Inputs */}
               <div className="lg:col-span-3 space-y-20">
                    <div className="relative">
                        <div className="absolute -left-12 top-0 text-[120px] font-black text-gray-100 select-none z-0">01</div>
                        <div className="relative z-10">
                            <FinancialInput data={userProfile} onChange={setUserProfile} />
                        </div>
                    </div>
               </div>

               {/* Right: Property Inputs */}
               <div className="lg:col-span-2 sticky top-32">
                    <div className="relative bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
                        <div className="absolute -top-10 -right-6 text-[100px] font-black text-[var(--primary)]/10 select-none">02</div>
                        <SectionTitle 
                            title="주택 정보" 
                            subtitle="매수를 고민 중인 집의 정보" 
                        />
                        <div className="mt-10">
                            <HousingInput data={property} onChange={setProperty} />
                        </div>

                        <div className="mt-16 space-y-4">
                            <button
                                onClick={handleCalculate}
                                className="w-full premium-button premium-button-primary shadow-[0_20px_60px_rgba(48,213,200,0.3)]"
                            >
                                분석 리포트 생성
                            </button>
                            
                            <AnimatePresence>
                                {validationErrors.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-6 bg-rose-50 text-rose-600 rounded-3xl text-sm font-bold border border-rose-100"
                                    >
                                        <p className="mb-2">⚠️ 확인이 필요합니다:</p>
                                        <ul className="space-y-1 text-xs opacity-70">
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

      {/* Results Rendering */}
      <AnimatePresence>
        {result && (
          <section ref={resultRef} className="py-40 bg-white rounded-[5rem] shadow-2xl relative z-20 mt-[-5rem]">
            <div className="max-w-6xl mx-auto px-6">
                <Reveal centered>
                    <div className="text-center mb-24">
                        <span className="text-[var(--primary)] font-black uppercase tracking-[0.4em] text-xs">Analysis Result</span>
                        <h2 className="text-6xl md:text-[100px] font-black tracking-tighter mt-4">분석 리포트.</h2>
                    </div>
                </Reveal>
                <ResultCard result={result} />
            </div>
          </section>
        )}
      </AnimatePresence>

      <ScrollLitText 
        text="당신의 꿈은 여기서 현실이 됩니다." 
        subtext="빅데이터 분석을 통해 당신의 한도 내에서 가장 가치 있는 매물을 매칭해 드릴 예정입니다.."
      />

      {/* Modern Mockup Section */}
      <section className="section-container bg-[var(--secondary)] rounded-[4rem] text-white overflow-hidden py-32 flex flex-col md:flex-row items-center gap-20">
         <div className="flex-1 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                한도에 딱 맞는<br/>
                <span className="text-[var(--primary)]">매물을 찾아드려요.</span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl font-medium max-w-md">
                입력된 예산을 바탕으로 실시간 실거래가 데이터를 매칭하여, 당신이 실제로 살 수 있는 아파트를 지도 위에서 바로 보여드릴 예정입니다.
            </p>
            <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl text-[var(--primary)] font-black text-xs uppercase tracking-widest">
                베타 테스트 준비 중
            </div>
         </div>
         <div className="flex-1 w-full max-w-lg aspect-square bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center text-8xl font-black text-white/10 select-none">
            MOCKUP
         </div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-white pt-48 pb-20 px-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            <span className="text-5xl font-black text-[var(--secondary)] tracking-tighter mb-12">
                Jip<span className="text-[var(--primary)]">Scout</span>
            </span>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-[var(--text-sub)] mb-20 lg:mb-32">
                <a href="#">Engine</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Copyright 2026</a>
            </div>
            <p className="text-[10px] text-gray-300 font-bold">PROUDLY BUILT WITH PRECISION FINANCE ENGINEERING.</p>
        </div>
      </footer>
    </div>
  );
}
