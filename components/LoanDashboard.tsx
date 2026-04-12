'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from './ui/Slider';
import { calculateLoanSummary } from '@/lib/calculator';
import { UserProfileInput, PropertyInput, FinalLoanSummary } from '@/types';
import { formatCurrencyKorean } from '@/lib/format';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  Percent,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const initialDraftUserProfile: UserProfileInput = {
  myIncome: '6000',
  spouseIncome: '0',
  cash: '10000',
  existingDebtPayment: '0',
  age: '33',
  isBirthdayPassed: false,
  jobType: 'employee',
  spouseJobType: 'employee',
  marriageStatus: 'single',
  isFirstTimeBuyer: true,
  isHomeless: true,
  newbornWithin2Years: false,
  childrenCount: '0',
  wantsGraduatedRepayment: false,
  hasExistingFirstHomeLoan: false,
  hasUsedFirstTimeLoanBefore: false,
  existingFirstHomeLoanBalance: '0',
  wantsNewbornRefinance: false,
  niceScore: '900',
  kcbScore: '900',
};

const initialDraftProperty: PropertyInput = {
  homePrice: '50000',
  kbPrice: '50000',
  exclusiveArea: '84',
  isCapitalArea: true,
  isRegulatedArea: false,
};

export default function LoanDashboard() {
  const [profile, setProfile] = useState<UserProfileInput>(initialDraftUserProfile);
  const [property, setProperty] = useState<PropertyInput>(initialDraftProperty);
  const [result, setResult] = useState<FinalLoanSummary | null>(null);

  useEffect(() => {
    const calculated = calculateLoanSummary(profile, property);
    setResult(calculated);
  }, [profile, property]);

  const updateProfile = (key: keyof UserProfileInput, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value.toString() }));
  };

  const updateProperty = (key: keyof PropertyInput, value: any) => {
    setProperty(prev => ({ ...prev, [key]: value.toString() }));
  };

  if (!result) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: Inputs with Sliders */}
        <div className="lg:col-span-6 space-y-12 bg-white rounded-[3rem] p-12 shadow-[var(--apple-shadow)] border border-gray-100">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                 <Calculator className="w-5 h-5 text-[var(--secondary)]" />
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black tracking-tighter">정보 입력</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Input Parameters</p>
              </div>
           </div>

           <div className="space-y-10">
              <Slider 
                label="본인 연소득" 
                unit="만원"
                min={2000} 
                max={20000} 
                step={100} 
                value={Number(profile.myIncome)} 
                onChange={(val) => updateProfile('myIncome', val)} 
              />
              <Slider 
                label="보유 현금" 
                unit="만원"
                min={0} 
                max={100000} 
                step={500} 
                value={Number(profile.cash)} 
                onChange={(val) => updateProfile('cash', val)} 
              />
              <Slider 
                label="희망 주택 가격" 
                unit="만원"
                min={10000} 
                max={150000} 
                step={1000} 
                value={Number(property.homePrice)} 
                onChange={(val) => {
                    updateProperty('homePrice', val);
                    updateProperty('kbPrice', val);
                }} 
              />
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="dashboard-card-white border-2 border-dashed">
                      <label className="text-[9px] font-black uppercase text-gray-400 block mb-2">대출 금리 (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={4.2}
                        readOnly
                        className="text-2xl font-black bg-transparent outline-none w-full"
                      />
                      <p className="text-[10px] font-bold text-gray-300 mt-1 italic">Simulation Default</p>
                  </div>
                  <div className="dashboard-card-white border-2 border-dashed">
                      <label className="text-[9px] font-black uppercase text-gray-400 block mb-2">대출 기간 (년)</label>
                      <input 
                        type="number" 
                        value={30}
                        readOnly
                        className="text-2xl font-black bg-transparent outline-none w-full"
                      />
                      <p className="text-[10px] font-bold text-gray-300 mt-1 italic">30 Years Fixed</p>
                  </div>
              </div>
           </div>
        </div>

        {/* RIGHT: Summary Dashboard */}
        <div className="lg:col-span-6 space-y-8 h-full">
           {/* BIG BLACK CARD: Monthly Payment */}
           <motion.div 
             key={result.monthlyRepayment}
             initial={{ scale: 0.98, opacity: 0.8 }}
             animate={{ scale: 1, opacity: 1 }}
             className="dashboard-card-dark min-h-[320px] flex flex-col justify-between"
           >
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">Estimated Monthly Burden</h4>
                    <p className="text-white text-xl font-black tracking-tighter mt-1">예상 월 상환액</p>
                 </div>
                 <div className="px-4 py-1.5 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60">원리금균등</div>
              </div>
              
              <div className="py-8">
                 <span className="text-7xl md:text-8xl font-black tracking-tighter">
                    {result.monthlyRepayment.toLocaleString()}
                 </span>
                 <span className="text-3xl font-black ml-2 opacity-40">원</span>
              </div>
              
              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <p className="text-white/40 text-[10px] font-bold">
                    대출 원금 {result.totalLoanAmount.toLocaleString()}만원, 30년 만기 기준
                  </p>
                  <TrendingUp className="w-5 h-5 text-[var(--primary)] opacity-50" />
              </div>
           </motion.div>

           {/* TWO SMALL CARDS: DSR / LTV */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="dashboard-card-white flex flex-col justify-between h-48">
                 <div className="flex items-center gap-2 mb-4">
                    <PieChart className="w-4 h-4 text-gray-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">예상 DSR</span>
                 </div>
                 <div>
                    <span className="text-4xl font-black tracking-tighter text-[var(--primary)]">{result.dsr.toFixed(1)}%</span>
                    <p className="text-[11px] font-bold text-gray-400 mt-2">안정적인 수준입니다.</p>
                 </div>
              </div>

              <div className="dashboard-card-white flex flex-col justify-between h-48">
                 <div className="flex items-center gap-2 mb-4">
                    <Percent className="w-4 h-4 text-gray-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">담보인정비율 (LTV)</span>
                 </div>
                 <div>
                    <span className="text-4xl font-black tracking-tighter text-[var(--secondary)]">
                        {Math.round((result.totalLoanAmount / Number(property.homePrice)) * 100)}%
                    </span>
                    <p className="text-[11px] font-bold text-gray-400 mt-2">수도권 일반 규제 기준</p>
                 </div>
              </div>
           </div>

           {/* ACTION BUTTON */}
           <button 
             onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
             className="w-full bg-[var(--primary)] text-white py-10 rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
           >
              상세 대출 상품 추천받기 
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
           </button>
        </div>

      </div>
    </div>
  );
}
