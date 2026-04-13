'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateLoanSummary } from '@/lib/calculator';
import { MARKET_RATE_CONFIG, BANK_MORTGAGE_RULES } from '@/lib/policies/loanRules';
import { formatManwonToKoreanPreview } from '@/lib/format';
import { SmartNumberField } from '@/components/ui/SmartNumberField';
import { SmartAreaField } from '@/components/ui/SmartAreaField';
import { TooltipHelp } from '@/components/ui/TooltipHelp';
import SaveButton from '@/components/SaveButton';
import {
  UserProfileInput, PropertyInput,
  MarriageStatus, JobType, HousingStatus,
  TransactionType, RepaymentMethod, RateType, HousingType
} from '@/types';
import {
  Calculator, TrendingUp, PieChart, Percent, ArrowLeft,
  Briefcase, Store, Cpu, Home, Key, Baby, MapPin, ShieldCheck,
  Building2, Star, ChevronDown, ChevronUp, RefreshCw, Save, AlertTriangle, Info
} from 'lucide-react';
import Link from 'next/link';

// ─── helpers ──────────────────────────────────────────────────────────────────

function calcAge(birthDate: string): { age: number; isBirthdayPassed: boolean } {
  if (!birthDate) return { age: 30, isBirthdayPassed: false };
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const isBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!isBirthdayPassed) age--;
  return { age, isBirthdayPassed };
}

function calcMonthlyPayment(loan: number, annualRate: number, years: number) {
  if (loan <= 0) return 0;
  const principal = loan * 10000;
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

// ─── section wrappers ─────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children, open, onToggle }: {
  title: string; icon: any; children: React.ReactNode; open: boolean; onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <span className="font-black text-sm text-[var(--secondary)] tracking-tight">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-6 pt-2 space-y-6 border-t border-gray-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RadioGroup({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
            value === opt.value
              ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white'
              : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({ label, value, onChange, tooltip }: {
  label: string; value: boolean; onChange: (v: boolean) => void; tooltip?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black text-gray-500">{label}</span>
        {tooltip && <TooltipHelp text={tooltip} />}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function LoanCheckRow({ label, hasLoan, balance, onToggle, onBalance, tooltip }: {
  label: string; hasLoan: boolean; balance: string;
  onToggle: () => void; onBalance: (v: number) => void; tooltip?: string;
}) {
  return (
    <div className="space-y-3">
      <ToggleRow label={label} value={hasLoan} onChange={onToggle} tooltip={tooltip} />
      <AnimatePresence>
        {hasLoan && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <SmartNumberField
              label={`${label} 잔액`}
              value={Number(balance) || 0}
              min={0} max={1000000} step={100}
              unit="만원"
              onChange={onBalance}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

const INITIAL_PROFILE: UserProfileInput = {
  birthDate: '1992-06-01',
  marriageStatus: 'single',
  marriageDate: '',
  myIncome: '6000',
  spouseIncome: '0',
  jobType: 'employee',
  spouseJobType: 'employee',
  childrenCount: '0',
  newbornWithin2Years: false,
  newbornDate: '',
  isHeadOfHousehold: true,
  housingStatus: 'homeless',
  hasHousingRight: false,
  netAssets: '10000',
  creditScore: '900',
  kcbScore: '900',
  niceScore: '900',
  showDetailedCreditScore: false,
  existingDebtPayment: '0',
  hasExistingMortgage: false,
  existingMortgageBalance: '0',
  hasJeonseLoan: false,
  jeonseLoanBalance: '0',
  hasFundLoan: false,
  fundLoanBalance: '0',
  creditLoanBalance: '0',
  isFirstTimeBuyer: true,
  cash: '10000',
  isHomeless: true,
  wantsGraduatedRepayment: false,
  hasExistingFirstHomeLoan: false,
  hasUsedFirstTimeLoanBefore: false,
  existingFirstHomeLoanBalance: '0',
  wantsNewbornRefinance: false,
  age: '33',
  isBirthdayPassed: false,
};

const INITIAL_PROPERTY: PropertyInput = {
  homePrice: '50000',
  kbPrice: '50000',
  housingType: 'apartment',
  exclusiveArea: '84',
  region: '',
  district: '',
  isCapitalArea: true,
  isRegulatedArea: false,
  transactionType: 'existing',
  contractDate: '',
  contractDepositDate: '',
  recruitAnnouncementDate: '',
  loanTermYears: '30',
  repaymentMethod: 'equalPrincipalInterest',
  rateType: 'fixed',
};

export default function LoanDashboardV3() {
  const [profile, setProfile] = useState<UserProfileInput>(INITIAL_PROFILE);
  const [property, setProperty] = useState<PropertyInput>(INITIAL_PROPERTY);

  // section open state
  const [sections, setSections] = useState({
    basic: true,
    finance: false,
    loans: false,
    house: false,
    conditions: false,
  });

  const toggleSection = (s: keyof typeof sections) =>
    setSections(prev => ({ ...prev, [s]: !prev[s] }));

  // derived for calc engine (bridge old types)
  const { age, isBirthdayPassed } = calcAge(profile.birthDate);

  const calcProfile = {
    ...profile,
    age: age.toString(),
    isBirthdayPassed,
    isHomeless: profile.housingStatus === 'homeless',
    wantsGraduatedRepayment: property.repaymentMethod === 'graduated',
    hasExistingFirstHomeLoan: profile.hasExistingMortgage,
    existingFirstHomeLoanBalance: profile.existingMortgageBalance,
    cash: profile.netAssets,
  };

  const result = useMemo(() => calculateLoanSummary(calcProfile, property), [calcProfile, property]);

  const annualRate = MARKET_RATE_CONFIG.baseMortgageAnnualRate +
    (property.isCapitalArea ? MARKET_RATE_CONFIG.capitalStressRate : MARKET_RATE_CONFIG.nonCapitalStressRate);
  const loanYears = Number(property.loanTermYears) || BANK_MORTGAGE_RULES.loanTermYears;
  const loanAmount = result.finalEstimatedLoanAmount;
  const homePrice = Number(property.homePrice) || 0;
  const monthlyPayment = calcMonthlyPayment(loanAmount, annualRate, loanYears);
  const ltv = homePrice > 0 ? Math.round((loanAmount / homePrice) * 100) : 0;
  const totalIncome = (Number(profile.myIncome) || 0) + (Number(profile.spouseIncome) || 0);
  const dsr = totalIncome > 0 ? ((monthlyPayment * 12) / (totalIncome * 10000)) * 100 : 0;

  const up = (key: keyof UserProfileInput, value: any) =>
    setProfile(prev => ({ ...prev, [key]: typeof value === 'number' ? value.toString() : value }));
  const pp = (key: keyof PropertyInput, value: any) =>
    setProperty(prev => ({ ...prev, [key]: typeof value === 'number' ? value.toString() : value }));

  const isMarried = profile.marriageStatus !== 'single';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-3xl border-b border-gray-100/70">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Home</span>
            </Link>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-black text-[var(--secondary)] tracking-tight">Loan Analysis Engine</span>
              <div className="px-2 py-0.5 bg-[var(--accent)] rounded-md text-[9px] font-black text-[var(--primary)] uppercase tracking-widest">v3.0</div>
            </div>
          </div>
          <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            이 결과는 참고용 예상치입니다 · 실제 심사는 금융기관 기준에 따라 달라집니다
          </p>
        </div>
      </nav>

      {/* Body */}
      <div className="pt-20 max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* ── LEFT: Input Panels ── */}
          <div className="xl:col-span-7 space-y-3">

            {/* ① 기본 정보 */}
            <SectionCard title="기본 정보" icon={Home} open={sections.basic} onToggle={() => toggleSection('basic')}>
              {/* 생년월일 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">생년월일</label>
                  <TooltipHelp text="만 나이와 장기 대출(50년 등) 자격 판단에 사용됩니다." />
                </div>
                <input
                  type="date"
                  value={profile.birthDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => up('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm font-black text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all bg-white"
                />
                {profile.birthDate && (
                  <p className="mt-1 text-[10px] text-gray-400 font-bold">만 {age}세 · 생일 {isBirthdayPassed ? '지남' : '안 지남'}</p>
                )}
              </div>

              {/* 혼인 상태 */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">혼인 상태</label>
                <RadioGroup
                  options={[{ value: 'single', label: '미혼' }, { value: 'newlywed', label: '신혼/예정' }, { value: 'married', label: '기혼' }]}
                  value={profile.marriageStatus}
                  onChange={(v) => up('marriageStatus', v as MarriageStatus)}
                />
              </div>

              {/* 혼인일/예정일 (조건부) */}
              <AnimatePresence>
                {isMarried && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
                      {profile.marriageStatus === 'newlywed' ? '결혼 예정일' : '혼인일'}
                    </label>
                    <input
                      type="date"
                      value={profile.marriageDate}
                      onChange={(e) => up('marriageDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm font-black text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all bg-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 세대주 / 생애최초 */}
              <div className="space-y-4">
                <ToggleRow
                  label="세대주 여부"
                  value={profile.isHeadOfHousehold}
                  onChange={(v) => up('isHeadOfHousehold', v)}
                  tooltip="주민등록등본상 세대를 대표하는 사람입니다. 일부 정책대출은 세대주여야 신청 가능합니다."
                />
                <ToggleRow
                  label="생애최초 여부"
                  value={profile.isFirstTimeBuyer}
                  onChange={(v) => up('isFirstTimeBuyer', v)}
                  tooltip="지금까지 주택을 한 번도 소유한 적이 없는 경우 생애최초입니다. 세금 혜택과 대출 한도에 영향을 줍니다."
                />
              </div>

              {/* 미성년 자녀 수 */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">미성년 자녀 수</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => up('childrenCount', Math.max(0, Number(profile.childrenCount) - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 hover:bg-gray-200">-</button>
                  <span className="text-xl font-black text-[var(--secondary)] w-6 text-center">{profile.childrenCount || '0'}</span>
                  <button onClick={() => up('childrenCount', Number(profile.childrenCount || '0') + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-400 hover:bg-gray-200">+</button>
                </div>
              </div>

              {/* 출산/입양 여부 */}
              <ToggleRow
                label="최근 2년 내 출산/입양"
                value={profile.newbornWithin2Years}
                onChange={(v) => up('newbornWithin2Years', v)}
                tooltip="신생아 특례 디딤돌 대출의 핵심 조건입니다. 대출 신청일 기준으로 2년 이내 출생/입양한 자녀가 있으면 해당됩니다."
              />
              <AnimatePresence>
                {profile.newbornWithin2Years && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Baby className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-emerald-700">신생아 특례 디딤돌 자격 확인 대상</span>
                    </div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">출산일/입양일</label>
                    <input
                      type="date"
                      value={profile.newbornDate}
                      onChange={(e) => up('newbornDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl text-sm font-black text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all bg-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 주택 보유 상태 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">주택 보유 상태</label>
                  <TooltipHelp text="본인 + 배우자 합산 기준입니다. 분양권/입주권도 주택으로 볼 수 있어 주의가 필요합니다." />
                </div>
                <RadioGroup
                  options={[
                    { value: 'homeless', label: '무주택' },
                    { value: 'oneHome', label: '1주택' },
                    { value: 'multiHome', label: '다주택' },
                  ]}
                  value={profile.housingStatus}
                  onChange={(v) => up('housingStatus', v as HousingStatus)}
                />
                {profile.housingStatus === 'multiHome' && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-amber-700">다주택자는 신생아 특례·디딤돌·보금자리론 등 정책대출 이용이 어렵습니다.</p>
                  </div>
                )}
              </div>

              {/* 분양권 여부 */}
              <ToggleRow
                label="분양권/입주권 보유 여부"
                value={profile.hasHousingRight}
                onChange={(v) => up('hasHousingRight', v)}
                tooltip="현재 분양권이나 조합원 입주권을 보유 중이라면 유주택자로 분류되어 정책 대출에서 불리할 수 있습니다."
              />
            </SectionCard>

            {/* ② 소득/자산/신용 */}
            <SectionCard title="소득 · 자산 · 신용" icon={TrendingUp} open={sections.finance} onToggle={() => toggleSection('finance')}>
              {/* 직업 */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">본인 직업</label>
                <RadioGroup
                  options={[
                    { value: 'employee', label: '직장인' },
                    { value: 'selfEmployed', label: '자영업' },
                    { value: 'freelancer', label: '프리랜서' },
                  ]}
                  value={profile.jobType}
                  onChange={(v) => up('jobType', v as JobType)}
                />
                {profile.jobType !== 'employee' && (
                  <p className="mt-2 text-[10px] text-amber-600 font-bold">* 자영업/프리랜서는 소득 입증 방식에 따라 인정 소득이 달라질 수 있습니다.</p>
                )}
              </div>

              {/* 본인 연소득 */}
              <SmartNumberField
                label="본인 연소득"
                value={Number(profile.myIncome)}
                min={0} max={1000000} step={100}
                unit="만원"
                tooltip="세전 연봉 기준입니다. 상여금, 수당 포함 총급여를 입력하세요."
                onChange={(v) => up('myIncome', v)}
              />

              {/* 배우자 (조건부) */}
              <AnimatePresence>
                {isMarried && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-5">
                    <div>
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">배우자 직업</label>
                      <RadioGroup
                        options={[
                          { value: 'employee', label: '직장인' },
                          { value: 'selfEmployed', label: '자영업' },
                          { value: 'freelancer', label: '프리랜서' },
                        ]}
                        value={profile.spouseJobType}
                        onChange={(v) => up('spouseJobType', v as JobType)}
                      />
                    </div>
                    <SmartNumberField
                      label="배우자 연소득"
                      value={Number(profile.spouseIncome)}
                      min={0} max={1000000} step={100}
                      unit="만원"
                      tooltip="정책대출은 부부합산 소득 기준으로 판정합니다."
                      onChange={(v) => up('spouseIncome', v)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 보유 현금 */}
              <SmartNumberField
                label="보유 현금 (사용 가능)"
                value={Number(profile.cash)}
                min={0} max={1000000} step={500}
                unit="만원"
                tooltip="계약금, 중도금, 잔금에 사용 가능한 실제 보유금입니다. 예적금, 주식 매도 가능액 포함."
                onChange={(v) => up('cash', v)}
              />

              {/* 순자산 */}
              <SmartNumberField
                label="순자산 (본인+배우자 합산)"
                value={Number(profile.netAssets)}
                min={0} max={1000000} step={500}
                unit="만원"
                tooltip="현금, 예금, 주식, 자동차, 부동산 등 자산에서 부채(각종 대출)를 뺀 금액입니다. 신생아 특례 등 자산 기준에 사용됩니다."
                onChange={(v) => up('netAssets', v)}
              />

              {/* 신용점수 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">신용점수</label>
                    <TooltipHelp text="KCB(나이스) 또는 NICE 기준 신용점수입니다. 점수가 낮으면 일부 정책 대출 조건이 달라질 수 있습니다." />
                  </div>
                  <button
                    onClick={() => up('showDetailedCreditScore', !profile.showDetailedCreditScore)}
                    className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline"
                  >
                    {profile.showDetailedCreditScore ? '간단 입력' : '상세 입력 (KCB/NICE)'}
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {profile.showDetailedCreditScore ? (
                    <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block">KCB 점수</label>
                        <input type="number" min={0} max={1000} value={profile.kcbScore}
                          onChange={(e) => up('kcbScore', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 mb-1 block">NICE 점수</label>
                        <input type="number" min={0} max={1000} value={profile.niceScore}
                          onChange={(e) => up('niceScore', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="simple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <input type="number" min={0} max={1000} value={profile.creditScore}
                        onChange={(e) => { up('creditScore', e.target.value); up('kcbScore', e.target.value); up('niceScore', e.target.value); }}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionCard>

            {/* ③ 기존 대출 */}
            <SectionCard title="기존 대출 현황" icon={PieChart} open={sections.loans} onToggle={() => toggleSection('loans')}>
              <SmartNumberField
                label="기존 월 부채 상환액"
                value={Number(profile.existingDebtPayment)}
                min={0} max={5000} step={10}
                unit="만원"
                tooltip="현재 매달 납부 중인 모든 대출 상환액의 합계입니다. (카드론, 자동차 할부, 마이너스 통장 이자 포함)"
                onChange={(v) => up('existingDebtPayment', v)}
              />
              <div className="h-px bg-gray-100" />
              <LoanCheckRow
                label="기존 주담대 보유"
                hasLoan={profile.hasExistingMortgage}
                balance={profile.existingMortgageBalance}
                onToggle={() => up('hasExistingMortgage', !profile.hasExistingMortgage)}
                onBalance={(v) => up('existingMortgageBalance', v)}
                tooltip="현재 주택담보대출을 보유 중이면 활성화하세요. 1주택자 갈아타기 판정에 사용됩니다."
              />
              <LoanCheckRow
                label="전세대출 보유"
                hasLoan={profile.hasJeonseLoan}
                balance={profile.jeonseLoanBalance}
                onToggle={() => up('hasJeonseLoan', !profile.hasJeonseLoan)}
                onBalance={(v) => up('jeonseLoanBalance', v)}
              />
              <LoanCheckRow
                label="기금대출 보유"
                hasLoan={profile.hasFundLoan}
                balance={profile.fundLoanBalance}
                onToggle={() => up('hasFundLoan', !profile.hasFundLoan)}
                onBalance={(v) => up('fundLoanBalance', v)}
                tooltip="디딤돌·보금자리론 등 주택도시기금 대출을 이전에 받은 적이 있거나 현재 있다면 활성화하세요."
              />
              <SmartNumberField
                label="신용대출 잔액"
                value={Number(profile.creditLoanBalance)}
                min={0} max={100000} step={100}
                unit="만원"
                tooltip="신용카드론, 마이너스통장, 개인신용대출 등의 잔액 합계입니다."
                onChange={(v) => up('creditLoanBalance', v)}
              />
            </SectionCard>

            {/* ④ 주택 정보 */}
            <SectionCard title="주택 정보" icon={Building2} open={sections.house} onToggle={() => toggleSection('house')}>
              {/* 거래 유형 */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">거래 유형</label>
                <RadioGroup
                  options={[
                    { value: 'existing', label: '기존 매매' },
                    { value: 'newBuild', label: '분양' },
                    { value: 'right', label: '입주권' },
                  ]}
                  value={property.transactionType}
                  onChange={(v) => pp('transactionType', v as TransactionType)}
                />
              </div>

              {/* 주택 가격 */}
              <SmartNumberField
                label="희망 주택 가격"
                value={Number(property.homePrice)}
                min={0} max={1000000} step={1000}
                unit="만원"
                tooltip="매수 희망 금액입니다. 실제 계약가 또는 시세 기준으로 입력하세요."
                onChange={(v) => { pp('homePrice', v); pp('kbPrice', v); }}
              />

              {/* 주택 유형 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">주택 유형</label>
                  <TooltipHelp text="오피스텔은 업무용/주거용 구분에 따라 대출 조건이 크게 다릅니다. 주거용 오피스텔이어야 일부 정책 대출 가능합니다." />
                </div>
                <RadioGroup
                  options={[
                    { value: 'apartment', label: '아파트' },
                    { value: 'villa', label: '연립' },
                    { value: 'multiplex', label: '다세대' },
                    { value: 'detached', label: '단독/다가구' },
                    { value: 'officetel', label: '오피스텔' },
                    { value: 'other', label: '기타' },
                  ]}
                  value={property.housingType}
                  onChange={(v) => pp('housingType', v as HousingType)}
                />
              </div>

              {/* 전용면적 */}
              <SmartAreaField
                label="전용면적"
                value={Number(property.exclusiveArea)}
                min={15} max={300} step={1}
                unit="㎡"
                tooltip="등기와 대출 심사에 쓰이는 전용면적입니다. 85㎡ 이하가 정책 대출의 기준이 됩니다."
                onChange={(v) => pp('exclusiveArea', v)}
              />

              {/* 지역 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">시/도</label>
                  <input
                    type="text" placeholder="서울특별시" value={property.region}
                    onChange={(e) => pp('region', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">시/군/구</label>
                  <input
                    type="text" placeholder="마포구" value={property.district}
                    onChange={(e) => pp('district', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* 수도권/규제지역 토글 */}
              <div className="space-y-3">
                <ToggleRow
                  label="수도권 여부"
                  value={property.isCapitalArea}
                  onChange={(v) => pp('isCapitalArea', v)}
                  tooltip="서울, 경기, 인천 지역이 이에 해당됩니다. 수도권은 스트레스 DSR이 더 높게 적용됩니다."
                />
                <ToggleRow
                  label="규제지역 여부"
                  value={property.isRegulatedArea}
                  onChange={(v) => pp('isRegulatedArea', v)}
                  tooltip="정부가 대출·세금 규제를 강하게 적용하는 지역입니다. LTV 한도가 낮아져 대출 가능 금액이 줄어듭니다."
                />
              </div>

              {/* 계약일 (기존 매매/분양 조건부) */}
              <AnimatePresence>
                {(property.transactionType === 'existing' || property.transactionType === 'right') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">매매계약일</label>
                      <input type="date" value={property.contractDate}
                        onChange={(e) => pp('contractDate', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">계약금 납부일</label>
                      <input type="date" value={property.contractDepositDate}
                        onChange={(e) => pp('contractDepositDate', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 분양 공고일 (분양 조건부) */}
              <AnimatePresence>
                {property.transactionType === 'newBuild' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                      입주자모집공고일
                    </label>
                    <TooltipHelp text="분양 공고가 난 날짜입니다. 일부 정책 대출은 공고일 기준으로 자격이 달라집니다." />
                    <input type="date" value={property.recruitAnnouncementDate}
                      onChange={(e) => pp('recruitAnnouncementDate', e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>

            {/* ⑤ 대출 조건 */}
            <SectionCard title="희망 대출 조건" icon={Percent} open={sections.conditions} onToggle={() => toggleSection('conditions')}>
              {/* 만기 */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">희망 만기</label>
                <RadioGroup
                  options={[
                    { value: '10', label: '10년' }, { value: '15', label: '15년' },
                    { value: '20', label: '20년' }, { value: '30', label: '30년' },
                    { value: '40', label: '40년' }, { value: '50', label: '50년' },
                  ]}
                  value={property.loanTermYears}
                  onChange={(v) => pp('loanTermYears', v)}
                />
              </div>

              {/* 상환 방식 */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">상환 방식</label>
                <RadioGroup
                  options={[
                    { value: 'equalPrincipalInterest', label: '원리금균등' },
                    { value: 'equalPrincipal', label: '원금균등' },
                    { value: 'graduated', label: '체증식' },
                  ]}
                  value={property.repaymentMethod}
                  onChange={(v) => { pp('repaymentMethod', v as RepaymentMethod); up('wantsGraduatedRepayment', v === 'graduated'); }}
                />
                <AnimatePresence>
                  {property.repaymentMethod === 'graduated' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-amber-700">
                        초기 월 부담은 낮아지지만, 시간이 갈수록 상환액이 커집니다. 디딤돌·신생아 특례에서는 체증식 이용 제한이 있을 수 있습니다.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 금리 유형 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">금리 유형</label>
                  <TooltipHelp text="고정형은 이자율이 변하지 않고, 변동형은 시장 금리에 따라 바뀝니다. 혼합형은 초기 5년 고정 후 변동으로 전환됩니다." />
                </div>
                <RadioGroup
                  options={[
                    { value: 'fixed', label: '고정형' },
                    { value: 'mixed', label: '혼합형' },
                    { value: 'periodic', label: '주기형' },
                    { value: 'variable', label: '변동형' },
                  ]}
                  value={property.rateType}
                  onChange={(v) => pp('rateType', v as RateType)}
                />
              </div>
            </SectionCard>
          </div>

          {/* ── RIGHT: Live Results (Sticky) ── */}
          <div className="xl:col-span-5 space-y-4 xl:sticky xl:top-24">

            {/* Monthly Payment */}
            <motion.div key={monthlyPayment} initial={{ scale: 0.98, opacity: 0.8 }} animate={{ scale: 1, opacity: 1 }}
              className="dashboard-card-dark min-h-[240px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">예상 월 상환액</h4>
                  <p className="text-white text-base font-black tracking-tighter mt-1">
                    {property.repaymentMethod === 'graduated' ? '체증식 초기 기준' : '원리금균등 기준'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/60">
                  {property.loanTermYears}년 만기
                </div>
              </div>
              <div className="py-4">
                <span className="text-5xl md:text-6xl font-black tracking-tighter">{monthlyPayment.toLocaleString()}</span>
                <span className="text-xl font-black ml-2 opacity-40">원</span>
              </div>
              <div className="pt-4 border-t border-white/10 text-white/40 text-[10px] font-bold">
                대출 원금 {loanAmount.toLocaleString()}만원 · {loanYears}년 · 연 {(annualRate * 100).toFixed(2)}% (가정)
              </div>
            </motion.div>

            {/* DSR / LTV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <PieChart className="w-4 h-4 text-gray-300" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">예상 DSR</span>
                  <TooltipHelp text="연 소득 대비 1년 동안 갚아야 하는 전체 대출 원리금 비율입니다. 40% 초과 시 대출이 제한될 수 있습니다." />
                </div>
                <span className={`text-3xl font-black tracking-tighter ${dsr < 40 ? 'text-emerald-500' : dsr < 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {dsr.toFixed(1)}%
                </span>
                <p className={`text-[10px] font-bold mt-1 ${dsr < 40 ? 'text-emerald-500' : dsr < 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {dsr < 40 ? '안정적' : dsr < 60 ? '주의' : '위험'}
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Percent className="w-4 h-4 text-gray-300" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">LTV</span>
                  <TooltipHelp text="집값 대비 대출 비율입니다. LTV 70%면 5억 집에 최대 3.5억까지 대출 가능." />
                </div>
                <span className="text-3xl font-black tracking-tighter text-[var(--secondary)]">{ltv}%</span>
                <p className="text-[10px] font-bold text-gray-400 mt-1">{property.isRegulatedArea ? '규제지역' : '일반'} 기준</p>
              </div>
            </div>

            {/* Product Cards */}
            <div className="space-y-2">
              {[
                { name: '신생아 특례', data: result.newbornSpecial },
                { name: '디딤돌', data: result.didimdol },
                { name: '보금자리론', data: result.bogeumjari },
                { name: '일반 주담대', data: result.bankMortgage },
              ].map(item => (
                <div key={item.name} className={`rounded-2xl border-2 px-5 py-4 transition-all ${
                  item.data.status === 'possible' ? 'bg-emerald-50 border-emerald-200' :
                  item.data.status === 'conditional' ? 'bg-amber-50 border-amber-200' :
                  'bg-gray-50 border-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.data.status === 'possible' ? 'bg-emerald-500' :
                        item.data.status === 'conditional' ? 'bg-amber-500' : 'bg-gray-300'
                      }`} />
                      <span className="font-black text-sm text-[var(--secondary)]">{item.name}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.data.status === 'possible' ? 'bg-emerald-100 text-emerald-700' :
                        item.data.status === 'conditional' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {item.data.status === 'possible' ? '가능' : item.data.status === 'conditional' ? '조건부' : '어려움'}
                      </span>
                    </div>
                    <span className="font-black text-base text-[var(--secondary)]">
                      {item.data.status === 'difficult' ? '—' : `${item.data.amount.toLocaleString()}만원`}
                    </span>
                  </div>
                  {/* Fail reasons */}
                  {item.data.failReasons && item.data.failReasons.length > 0 && (
                    <div className="mt-2 ml-5 space-y-1">
                      {item.data.failReasons.slice(0, 2).map((r, i) => (
                        <p key={i} className="text-[10px] font-bold text-gray-500">· {r}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Buying Power */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-3xl p-7 text-white text-center">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">총 구매 가능 금액</p>
              <span className="text-4xl font-black tracking-tighter">{formatManwonToKoreanPreview(result.totalBuyingPower)}</span>
              <p className="text-white/60 text-xs font-bold mt-2">
                대출 {formatManwonToKoreanPreview(loanAmount)} + 현금 {formatManwonToKoreanPreview(result.userCash)}
              </p>
            </div>

            {/* Save */}
            <SaveButton profile={calcProfile as any} property={property} result={result} />

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-300 font-bold px-4 leading-relaxed">
              이 결과는 입력값 기반의 예상치입니다. 실제 가능 여부는 금융기관 심사, 최신 규제, 증빙서류에 따라 달라집니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
