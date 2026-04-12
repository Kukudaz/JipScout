'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const validateInputs = (): string[] => {
    const errors = validateNumericFields([
      { label: '본인 연소득', value: userProfile.myIncome, required: true, min: 0 },
      { label: '배우자 연소득', value: userProfile.spouseIncome, min: 0 },
      { label: '보유 현금', value: userProfile.cash, required: true, min: 0 },
      { label: '기존 월 부채 상환액', value: userProfile.existingDebtPayment, min: 0 },
      { label: '나이', value: userProfile.age, required: true, min: 19, max: 120 },
      { label: '자녀 수', value: userProfile.childrenCount, min: 0 },
      { label: '기존 정책 대출 잔액', value: userProfile.existingFirstHomeLoanBalance, min: 0 },
      { label: '희망 매매가', value: property.homePrice, required: true, min: 1 },
      { label: '전용면적', value: property.exclusiveArea, required: true, min: 1 },
    ]);
    return errors;
  };

  const handleCalculate = () => {
    const errors = validateInputs();
    setValidationErrors(errors);
    if (errors.length > 0) {
      setResult(null);
      return;
    }

    const calculated = calculateLoanSummary(userProfile, property);
    setResult(calculated);
    
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToChecker = () => {
      checkerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  return (
    <div className="min-h-screen bg-[var(--secondary-bg)] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black text-[var(--secondary)] tracking-tighter">
            Jip<span className="text-[var(--primary)]">Scout</span>
          </span>
          <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-widest text-[var(--text-sub)]">
            <a href="#" className="text-[var(--secondary)]">Overview</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors opacity-40">Property matching</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors opacity-40">Trends</a>
          </div>
          <button onClick={scrollToChecker} className="premium-button premium-button-primary text-[10px] py-2 px-5">
            지금 계산하기
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-container pt-56 pb-20">
        <Reveal>
          <h1 className="hero-text text-center mb-12">
            드디어 당신이<br/>
            <span className="text-[var(--primary)]">살 수 있는 집</span>을<br/>
            찾았습니다.
          </h1>
        </Reveal>
      </section>

      {/* Cinematic Scroll Sections */}
      <ScrollLitText 
        text="가장 정밀한 데이터를 경험하세요." 
        subtext="2026년 최신 국가 정책(신생아 특례, 디딤돌)과 은행권 스트레스 DSR을 모두 실시간으로 반영합니다."
      />

      <ScrollLitText 
        text="복잡한 대출을 숫자로 시각화하다." 
        subtext="단순히 '가능/불가'를 넘어, 당신의 예산과 현금 흐름을 완벽하게 분석하여 한눈에 보여드립니다."
      />

      {/* Main Checker Section */}
      <section ref={checkerRef} className="max-w-6xl mx-auto px-6 py-40">
        <PremiumCard className="relative">
          <div className="absolute top-8 left-8">
             <span className="bg-[var(--accent)] text-[var(--primary)] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Calculator Engine v.2026
             </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-10">
            <div className="space-y-10">
              <SectionTitle 
                title="프로필 입력" 
                subtitle="나와 배우자(와이프)의 조건을 상세히 알려주세요." 
              />
              <FinancialInput data={userProfile} onChange={setUserProfile} />
            </div>
            <div className="space-y-10">
              <SectionTitle 
                title="주택 정보" 
                subtitle="매수를 고민 중인 집의 정보를 입력하세요." 
              />
              <HousingInput data={property} onChange={setProperty} />
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <button
              onClick={handleCalculate}
              className="w-full md:w-auto md:px-24 premium-button premium-button-primary py-6 text-2xl font-black shadow-[0_20px_50px_rgba(48,213,200,0.3)] hover:scale-[1.02]"
            >
              분석 리포트 생성하기
            </button>

            <AnimatePresence>
              {validationErrors.length > 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-8 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-600 overflow-hidden text-left"
                >
                  <p className="font-black text-sm mb-3">⚠️ 입력을 완료해주세요:</p>
                  <ul className="text-xs space-y-2 opacity-80">
                    {validationErrors.map((err, i) => (
                      <li key={i} className="flex gap-2"><span>•</span> {err}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PremiumCard>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <section ref={resultRef} className="section-container bg-white rounded-[5rem] shadow-2xl mt-[-5rem] relative z-10 py-40 border-t border-gray-100">
            <Reveal centered>
                <div className="mb-20">
                    <span className="text-[var(--primary)] font-black tracking-widest uppercase text-xs">Analysis Complete</span>
                    <h2 className="text-5xl md:text-7xl font-black mt-4">분석 리포트</h2>
                </div>
            </Reveal>
            <ResultCard result={result} />
          </section>
        )}
      </AnimatePresence>

      <ScrollLitText 
        text="우리는 매물 그 이상을 봅니다." 
        subtext="한도 판정이 끝나면 당신의 예산에 딱 맞는 최고의 아파트들을 추천해 드립니다."
      />

      {/* Footer */}
      <footer className="bg-white py-32 px-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="md:col-span-2 space-y-6">
            <span className="text-3xl font-black text-[var(--secondary)] tracking-tighter">Jip<span className="text-[var(--primary)]">Scout</span></span>
            <p className="text-sm text-[var(--text-sub)] max-w-sm leading-relaxed">
              모든 사람이 안전하고 투명하게 내 집 마련의 꿈을 설계할 수 있도록 정밀 금융 공학으로 계산합니다.
            </p>
          </div>
          <div className="space-y-6 text-sm">
            <p className="font-black text-[var(--secondary)] uppercase tracking-widest text-xs">Policy</p>
            <p className="text-[var(--text-sub)] cursor-not-allowed">이용약관</p>
            <p className="text-[var(--text-sub)] cursor-not-allowed">개인정보처리방침</p>
          </div>
          <div className="space-y-6 text-sm">
            <p className="font-black text-[var(--secondary)] uppercase tracking-widest text-xs">Contact</p>
            <p className="text-[var(--text-sub)]">partnership@jipscout.com</p>
            <p className="text-xs text-gray-400">© 2026 JipScout Design.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
