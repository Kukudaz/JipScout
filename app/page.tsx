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

  const validateInputs = (): string[] => {
    const errors = validateNumericFields([
      { label: '본인 연소득', value: userProfile.myIncome, required: true, min: 0 },
      { label: '배우자 연소득', value: userProfile.spouseIncome, min: 0 },
      { label: '보유 현금', value: userProfile.cash, required: true, min: 0 },
      { label: '기존 월 부채 상환액', value: userProfile.existingDebtPayment, min: 0 },
      { label: '나이', value: userProfile.age, required: true, min: 19, max: 120 },
      { label: '자녀 수', value: userProfile.childrenCount, min: 0 },
      { label: '기존 생애최초 신혼부부 대출 잔액', value: userProfile.existingFirstHomeLoanBalance, min: 0 },
      { label: 'NICE 점수', value: userProfile.niceScore, min: 0, max: 1000 },
      { label: 'KCB 점수', value: userProfile.kcbScore, min: 0, max: 1000 },
      { label: '희망 매매가', value: property.homePrice, required: true, min: 1 },
      { label: 'KB시세', value: property.kbPrice, min: 1 },
      { label: '전용면적', value: property.exclusiveArea, required: true, min: 1 },
    ]);

    if (userProfile.wantsNewbornRefinance && !userProfile.hasExistingFirstHomeLoan) {
      errors.push('신생아 특례 갈아타기를 원하면 기존 생애최초 신혼부부 대출 여부를 체크해주세요');
    }

    if (userProfile.hasExistingFirstHomeLoan && userProfile.existingFirstHomeLoanBalance.trim() === '') {
      errors.push('기존 잔액을 입력해주세요');
    }

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
    
    // Smooth scroll to results
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[var(--secondary-bg)]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black text-[var(--secondary)] tracking-tighter">
            Jip<span className="text-[var(--primary)]">Scout</span>
          </span>
          <div className="hidden md:flex gap-8 text-sm font-medium text-[var(--text-sub)]">
            <a href="#" className="hover:text-[var(--primary)] transition-colors">내 한도</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors opacity-40">매물 찾기</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors opacity-40">거래 트렌드</a>
          </div>
          <button className="premium-button premium-button-secondary text-xs">
            로그인
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-container pt-40 pb-20 text-center">
        <Reveal>
          <h1 className="hero-text mb-6">
            집을 찾기 전,<br/>
            나의 <span className="text-[var(--primary)]">진짜 예산</span>부터.
          </h1>
          <p className="text-xl text-[var(--text-sub)] max-w-2xl mx-auto leading-relaxed">
            2026년 최신 금융 정책을 반영한 초정밀 대출 판정 엔진.<br/>
            신생아 특례부터 체증식 상환까지, 당신이 가질 수 있는 모든 옵션을 한 눈에 시각화합니다.
          </p>
        </Reveal>
      </section>

      {/* Calculator Section */}
      <section className="max-w-5xl mx-auto px-6 pb-40">
        <PremiumCard className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <SectionTitle 
                title="금융 프로필" 
                subtitle="소득과 현금, 부채 수준을 입력하세요." 
              />
              <FinancialInput data={userProfile} onChange={setUserProfile} />
            </div>
            <div className="space-y-8">
              <SectionTitle 
                title="희망 주택" 
                subtitle="관심 있는 단지의 정보를 입력하세요." 
              />
              <HousingInput data={property} onChange={setProperty} />
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100">
            <button
              onClick={handleCalculate}
              className="w-full premium-button premium-button-primary py-5 text-xl font-black shadow-2xl hover:translate-y-[-2px]"
            >
              내 한도 정밀 분석 시작하기
            </button>

            <AnimatePresence>
              {validationErrors.length > 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-600 overflow-hidden"
                >
                  <p className="font-bold mb-2">입력값을 확인해주세요:</p>
                  <ul className="text-sm space-y-1">
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
          <section ref={resultRef} className="section-container border-t border-gray-200">
            <SectionTitle 
              title="분석 결과 리포트" 
              subtitle="당신을 위한 최적의 대출 시나리오를 찾았습니다."
              centered 
            />
            <ResultCard result={result} />
          </section>
        )}
      </AnimatePresence>

      {/* Feature Placeholders */}
      <section className="section-container bg-[var(--secondary)] text-white rounded-[4rem] mx-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                      한도에 딱 맞는<br/>
                      <span className="text-[var(--primary)]">매물을 찾아드려요.</span>
                  </h2>
                  <p className="text-lg opacity-60 mb-10 leading-relaxed">
                      입력된 예산을 바탕으로 실시간 실거래가 데이터를 매칭하여, <br/>
                      당신이 실제로 살 수 있는 아파트를 지도 위에서 바로 보여드릴 예정입니다.
                  </p>
                  <button className="premium-button premium-button-primary opacity-50 cursor-not-allowed">
                      베타 테스트 준비 중
                  </button>
              </div>
              <div className="relative aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center">
                  <span className="text-white/20 text-8xl font-black uppercase tracking-tighter">Mockup</span>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <span className="text-2xl font-black text-[var(--secondary)]">JipScout</span>
            <p className="text-sm text-[var(--text-sub)] max-w-xs">
              2026 정밀 대출 판정 시스템. <br/>
              우리는 당신의 내 집 마련 여정을 기술로 응원합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <div className="space-y-3">
              <p className="font-bold text-[var(--secondary)]">서비스</p>
              <p className="text-[var(--text-sub)]">한도 판정</p>
              <p className="text-[var(--text-sub)]">매물 찾기</p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-[var(--secondary)]">정책 정보</p>
              <p className="text-[var(--text-sub)]">신생아 특례</p>
              <p className="text-[var(--text-sub)]">디딤돌/보금자리</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
