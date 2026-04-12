'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from './ui/Slider';
import { calculateLoanSummary } from '@/lib/calculator';
import { UserProfileInput, PropertyInput, MarriageStatus, JobType } from '@/types';
import { MARKET_RATE_CONFIG, BANK_MORTGAGE_RULES } from '@/lib/policies/loanRules';
import { formatCurrencyKorean } from '@/lib/format';
import { 
  Calculator, TrendingUp, PieChart, Percent, ChevronRight,
  Briefcase, Store, Cpu, User, Heart, Users, Home, Key, Baby,
  MapPin, ShieldCheck, RefreshCw
} from 'lucide-react';

const JOB_OPTIONS: { value: JobType; label: string; icon: any }[] = [
  { value: 'employee', label: '직장인', icon: Briefcase },
  { value: 'selfEmployed', label: '자영업자', icon: Store },
  { value: 'freelancer', label: '프리랜서', icon: Cpu },
];

const MARRIAGE_OPTIONS: { value: MarriageStatus; label: string }[] = [
  { value: 'single', label: '미혼' },
  { value: 'newlywed', label: '신혼/예정' },
  { value: 'married', label: '기혼' },
];

function calcMonthlyPayment(loanManwon: number, annualRate: number, years: number): number {
  if (loanManwon <= 0) return 0;
  const principal = loanManwon * 10000;
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

export default function LoanDashboard() {
  const [profile, setProfile] = useState<UserProfileInput>({
    myIncome: '6000', spouseIncome: '0', cash: '10000', existingDebtPayment: '0',
    age: '33', isBirthdayPassed: false, jobType: 'employee', spouseJobType: 'employee',
    marriageStatus: 'single', isFirstTimeBuyer: true, isHomeless: true,
    newbornWithin2Years: false, childrenCount: '0', wantsGraduatedRepayment: false,
    hasExistingFirstHomeLoan: false, hasUsedFirstTimeLoanBefore: false,
    existingFirstHomeLoanBalance: '0', wantsNewbornRefinance: false,
    niceScore: '900', kcbScore: '900',
  });

  const [property, setProperty] = useState<PropertyInput>({
    homePrice: '50000', kbPrice: '50000', exclusiveArea: '84',
    isCapitalArea: true, isRegulatedArea: false,
  });

  const result = useMemo(() => calculateLoanSummary(profile, property), [profile, property]);

  const annualRate = MARKET_RATE_CONFIG.baseMortgageAnnualRate +
    (property.isCapitalArea ? MARKET_RATE_CONFIG.capitalStressRate : MARKET_RATE_CONFIG.nonCapitalStressRate);
  const loanYears = BANK_MORTGAGE_RULES.loanTermYears;
  const loanAmount = result.finalEstimatedLoanAmount;
  const homePrice = Number(property.homePrice) || 0;
  const monthlyPayment = calcMonthlyPayment(loanAmount, annualRate, loanYears);
  const ltv = homePrice > 0 ? Math.round((loanAmount / homePrice) * 100) : 0;
  const totalIncome = (Number(profile.myIncome) || 0) + (Number(profile.spouseIncome) || 0);
  const dsr = totalIncome > 0 ? ((monthlyPayment * 12) / (totalIncome * 10000)) * 100 : 0;

  const up = (key: keyof UserProfileInput, value: any) => setProfile(prev => ({ ...prev, [key]: typeof value === 'number' ? value.toString() : value }));
  const pp = (key: keyof PropertyInput, value: any) => setProperty(prev => ({ ...prev, [key]: typeof value === 'number' ? value.toString() : value }));

  const isMarried = profile.marriageStatus !== 'single';

  const Toggle = ({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: any }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all text-sm font-black whitespace-nowrap ${active ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LEFT: All Inputs */}
        <div className="lg:col-span-7 space-y-8 bg-white rounded-[3rem] p-10 shadow-[var(--apple-shadow)] border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[var(--secondary)]" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tighter">정보 입력</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">정확한 진단을 위해 현재 상황을 입력해주세요.</p>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-8">
            <Slider label="연소득 (본인)" unit="만원" min={0} max={100000} step={100} value={Number(profile.myIncome)} onChange={(v) => up('myIncome', v)} showKorean />

            <AnimatePresence>
              {isMarried && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <Slider label="연소득 (배우자)" unit="만원" min={0} max={100000} step={100} value={Number(profile.spouseIncome)} onChange={(v) => up('spouseIncome', v)} showKorean />
                </motion.div>
              )}
            </AnimatePresence>

            <Slider label="보유 현금" unit="만원" min={0} max={1000000} step={500} value={Number(profile.cash)} onChange={(v) => up('cash', v)} showKorean />
            <Slider label="기존 월 부채 상환액" unit="만원" min={0} max={2000} step={5} value={Number(profile.existingDebtPayment)} onChange={(v) => up('existingDebtPayment', v)} showKorean />
            <Slider label="만 나이" unit="세" min={19} max={65} step={1} value={Number(profile.age)} onChange={(v) => up('age', v)} />

            <div className="h-px bg-gray-100" />

            <Slider label="희망 주택 가격" unit="만원" min={10000} max={1000000} step={1000} value={homePrice} onChange={(v) => { pp('homePrice', v); pp('kbPrice', v); }} showKorean />
            <Slider label="전용면적" unit="㎡" min={30} max={150} step={1} value={Number(property.exclusiveArea)} onChange={(v) => pp('exclusiveArea', v)} />
          </div>

          {/* Compact Option Grid */}
          <div className="space-y-5 pt-4">
            {/* Marriage */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">혼인 상태</label>
              <div className="flex gap-2">
                {MARRIAGE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => up('marriageStatus', opt.value)}
                    className={`flex-1 py-3 rounded-2xl font-black text-sm border-2 transition-all ${profile.marriageStatus === opt.value ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white' : 'bg-white border-gray-100 text-gray-400'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">본인 직업</label>
              <div className="flex gap-2">
                {JOB_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => up('jobType', opt.value)}
                    className={`flex-1 py-3 rounded-2xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${profile.jobType === opt.value ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white' : 'bg-white border-gray-100 text-gray-400'}`}>
                    <opt.icon className={`w-4 h-4 ${profile.jobType === opt.value ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spouse Job (conditional) */}
            <AnimatePresence>
              {isMarried && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">배우자 직업</label>
                  <div className="flex gap-2">
                    {JOB_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => up('spouseJobType', opt.value)}
                        className={`flex-1 py-3 rounded-2xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${profile.spouseJobType === opt.value ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white' : 'bg-white border-gray-100 text-gray-400'}`}>
                        <opt.icon className={`w-4 h-4 ${profile.spouseJobType === opt.value ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Children */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">미성년 자녀 수</label>
              <div className="flex items-center gap-4">
                <button onClick={() => up('childrenCount', Math.max(0, Number(profile.childrenCount) - 1))} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 hover:bg-gray-200">-</button>
                <span className="text-xl font-black text-[var(--secondary)] w-6 text-center">{profile.childrenCount || '0'}</span>
                <button onClick={() => up('childrenCount', Number(profile.childrenCount || '0') + 1)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 hover:bg-gray-200">+</button>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Toggle Options Grid */}
            <div className="grid grid-cols-2 gap-2">
              <Toggle active={profile.isFirstTimeBuyer as boolean} onClick={() => up('isFirstTimeBuyer', !profile.isFirstTimeBuyer)} label="생애최초" icon={Home} />
              <Toggle active={profile.isHomeless as boolean} onClick={() => up('isHomeless', !profile.isHomeless)} label="무주택" icon={Key} />
              <Toggle active={profile.newbornWithin2Years as boolean} onClick={() => up('newbornWithin2Years', !profile.newbornWithin2Years)} label="2년 내 출산" icon={Baby} />
              <Toggle active={profile.wantsGraduatedRepayment as boolean} onClick={() => up('wantsGraduatedRepayment', !profile.wantsGraduatedRepayment)} label="체증식" icon={TrendingUp} />
              <Toggle active={property.isCapitalArea as boolean} onClick={() => pp('isCapitalArea', !property.isCapitalArea)} label="수도권" icon={MapPin} />
              <Toggle active={property.isRegulatedArea as boolean} onClick={() => pp('isRegulatedArea', !property.isRegulatedArea)} label="규제지역" icon={ShieldCheck} />
              <Toggle active={profile.hasExistingFirstHomeLoan as boolean} onClick={() => up('hasExistingFirstHomeLoan', !profile.hasExistingFirstHomeLoan)} label="갈아타기" icon={RefreshCw} />
              <Toggle active={profile.isBirthdayPassed as boolean} onClick={() => up('isBirthdayPassed', !profile.isBirthdayPassed)} label="생일 지남" icon={User} />
            </div>
          </div>
        </div>

        {/* RIGHT: Live Results */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Monthly Payment Card */}
          <motion.div key={monthlyPayment} initial={{ scale: 0.98, opacity: 0.8 }} animate={{ scale: 1, opacity: 1 }}
            className="dashboard-card-dark min-h-[280px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">예상 월 상환액</h4>
                <p className="text-white text-lg font-black tracking-tighter mt-1">Estimated Monthly</p>
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60">원리금균등</div>
            </div>
            <div className="py-6">
              <span className="text-5xl md:text-6xl font-black tracking-tighter">{monthlyPayment.toLocaleString()}</span>
              <span className="text-xl font-black ml-2 opacity-40">원</span>
            </div>
            <div className="pt-4 border-t border-white/10 text-white/40 text-[10px] font-bold">
              대출 원금 {loanAmount.toLocaleString()}만원 · {loanYears}년 만기
            </div>
          </motion.div>

          {/* DSR / LTV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-4 h-4 text-gray-300" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">예상 DSR</span>
              </div>
              <span className={`text-3xl font-black tracking-tighter ${dsr < 40 ? 'text-[var(--primary)]' : dsr < 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                {dsr.toFixed(1)}%
              </span>
              <p className="text-[10px] font-bold text-gray-400 mt-1">
                {dsr < 40 ? '안정적' : dsr < 60 ? '주의' : '위험'}
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="w-4 h-4 text-gray-300" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">LTV</span>
              </div>
              <span className="text-3xl font-black tracking-tighter text-[var(--secondary)]">{ltv}%</span>
              <p className="text-[10px] font-bold text-gray-400 mt-1">{property.isRegulatedArea ? '규제지역' : '일반'} 기준</p>
            </div>
          </div>

          {/* Product Summary Cards */}
          <div className="space-y-3">
            {[
              { name: '신생아 특례', data: result.newbornSpecial },
              { name: '디딤돌', data: result.didimdol },
              { name: '보금자리론', data: result.bogeumjari },
              { name: '일반 주담대', data: result.bankMortgage },
            ].map(item => (
              <div key={item.name} className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${
                item.data.status === 'possible' ? 'bg-emerald-50 border-emerald-200' :
                item.data.status === 'conditional' ? 'bg-amber-50 border-amber-200' :
                'bg-gray-50 border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    item.data.status === 'possible' ? 'bg-emerald-500' :
                    item.data.status === 'conditional' ? 'bg-amber-500' :
                    'bg-gray-300'
                  }`} />
                  <span className="font-black text-sm text-[var(--secondary)]">{item.name}</span>
                </div>
                <span className="font-black text-lg text-[var(--secondary)]">
                  {item.data.status === 'difficult' ? '불가' : `${item.data.amount.toLocaleString()}만원`}
                </span>
              </div>
            ))}
          </div>

          {/* Total Buying Power */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-[2rem] p-8 text-white text-center">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">총 구매 가능 금액</p>
            <span className="text-4xl font-black tracking-tighter">{result.totalBuyingPower.toLocaleString()}만원</span>
            <p className="text-white/60 text-xs font-bold mt-2">대출 {loanAmount.toLocaleString()}만원 + 현금 {result.userCash.toLocaleString()}만원</p>
          </div>
        </div>
      </div>
    </div>
  );
}
