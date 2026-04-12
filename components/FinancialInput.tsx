'use client';

import { UserProfileInput, MarriageStatus, JobType } from '@/types';
import { parseNumber, formatCurrencyKorean } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Store, 
  Cpu, 
  User, 
  Heart, 
  Users, 
  Home, 
  Key, 
  Baby, 
  TrendingUp, 
  RefreshCw,
  Plus,
  Minus,
  Trophy,
  Activity
} from 'lucide-react';

interface Props {
  data: UserProfileInput;
  onChange: (data: UserProfileInput) => void;
}

const JOB_OPTIONS: { value: JobType; label: string; icon: any }[] = [
  { value: 'employee', label: '직장인', icon: Briefcase },
  { value: 'selfEmployed', label: '자영업자', icon: Store },
  { value: 'freelancer', label: '프리랜서', icon: Cpu }
];

const MARRIAGE_OPTIONS: { value: MarriageStatus; label: string; sub: string; icon: any }[] = [
  { value: 'single', label: '미혼', sub: 'Single', icon: User },
  { value: 'newlywed', label: '신혼/예정', sub: 'Newlywed', icon: Heart },
  { value: 'married', label: '기혼', sub: 'Married', icon: Users }
];

export default function FinancialInput({ data, onChange }: Props) {
  const update = <K extends keyof UserProfileInput>(key: K, value: UserProfileInput[K]) => {
    onChange({ ...data, [key]: value });
  };

  const renderMoney = (val: string) => {
    const num = parseNumber(val);
    return num > 0 ? formatCurrencyKorean(num) : '';
  };

  const isMarried = data.marriageStatus !== 'single';

  return (
    <div className="space-y-24">
      {/* 1. Marriage Status Section - Pro Selection Tiles */}
      <div className="space-y-10">
        <label className="text-2xl font-black tracking-tighter text-center block mb-10">현재 혼인 상태는 어떠신가요?</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MARRIAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('marriageStatus', opt.value)}
              className={`pro-tile h-40 ${
                data.marriageStatus === opt.value
                  ? 'pro-tile-active'
                  : 'pro-tile-inactive'
              }`}
            >
              <opt.icon className={`w-8 h-8 ${data.marriageStatus === opt.value ? 'text-[var(--primary)]' : 'text-gray-300'}`} />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black tracking-tighter">{opt.label}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{opt.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Me & Spouse Side-by-Side Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* MY PROFILE */}
        <div className="bg-white rounded-[4rem] p-12 shadow-[var(--apple-shadow)] border border-gray-100 space-y-12">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white shadow-lg">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter text-[var(--secondary)]">본인 상세 프로필</h3>
           </div>
           
           <div className="space-y-10">
              <div>
                <label className="input-label">본인 연소득 (만원)</label>
                <div className="relative group">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.myIncome}
                        onChange={(e) => update('myIncome', e.target.value)}
                        className="premium-input text-4xl py-10"
                        placeholder="0"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xl font-black text-gray-200">만원</div>
                </div>
                {renderMoney(data.myIncome) && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-lg text-[var(--primary)] font-black text-right">
                        {renderMoney(data.myIncome)}
                    </motion.p>
                )}
              </div>

              <div className="space-y-6">
                <label className="input-label">본인 직업 형태</label>
                <div className="grid grid-cols-3 gap-3">
                   {JOB_OPTIONS.map(opt => (
                     <button
                        key={opt.value}
                        onClick={() => update('jobType', opt.value)}
                        className={`py-6 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 ${
                           data.jobType === opt.value 
                           ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-xl' 
                           : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                        }`}
                     >
                        <opt.icon className={`w-6 h-6 ${data.jobType === opt.value ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
                        <span className="text-sm font-black tracking-tight">{opt.label}</span>
                     </button>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* SPOUSE PROFILE */}
        <AnimatePresence mode="wait">
            <motion.div 
               key={data.marriageStatus === 'single' ? 'single' : 'married'}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className={`rounded-[4rem] p-12 border-2 transition-all space-y-12 ${
                  isMarried 
                  ? 'bg-white shadow-[var(--apple-shadow)] border-gray-100' 
                  : 'bg-gray-50 border-dashed border-gray-200 grayscale opacity-40'
               }`}
            >
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isMarried ? 'bg-[var(--primary)] text-white' : 'bg-gray-300 text-white'}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className={`text-2xl font-black tracking-tighter ${isMarried ? 'text-[var(--secondary)]' : 'text-gray-400'}`}>배우자 상세 프로필</h3>
               </div>
               
               {!isMarried ? (
                   <div className="py-24 text-center">
                       <p className="text-gray-400 font-black text-lg">미혼 상태입니다.</p>
                       <p className="text-sm text-gray-300 font-bold mt-2">상태값이 '기혼/신혼'일 때 활성화됩니다.</p>
                   </div>
               ) : (
                   <div className="space-y-10">
                        <div>
                            <label className="input-label">배우자 연소득 (만원)</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={data.spouseIncome}
                                    onChange={(e) => update('spouseIncome', e.target.value)}
                                    className="premium-input text-4xl py-10"
                                    placeholder="0"
                                />
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xl font-black text-gray-200">만원</div>
                            </div>
                            {renderMoney(data.spouseIncome) && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-lg text-[var(--primary)] font-black text-right">
                                    {renderMoney(data.spouseIncome)}
                                </motion.p>
                            )}
                        </div>

                        <div className="space-y-6">
                            <label className="input-label">배우자 직업 형태</label>
                            <div className="grid grid-cols-3 gap-3">
                            {JOB_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => update('spouseJobType', opt.value)}
                                    className={`py-6 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 ${
                                    data.spouseJobType === opt.value 
                                    ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-xl' 
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <opt.icon className={`w-6 h-6 ${data.spouseJobType === opt.value ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
                                    <span className="text-sm font-black tracking-tight">{opt.label}</span>
                                </button>
                            ))}
                            </div>
                        </div>
                   </div>
               )}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Household Context - Massive Inputs */}
      <div className="bg-white rounded-[4rem] p-16 shadow-[var(--apple-shadow)] border border-gray-100">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-6">
                <label className="input-label flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--primary)]" /> 만 나이
                </label>
                <div className="flex items-center gap-6">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.age}
                        onChange={(e) => update('age', e.target.value)}
                        className="premium-input text-center text-5xl py-8 w-32"
                        placeholder="33"
                    />
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${data.isBirthdayPassed ? 'bg-[var(--primary)] border-[var(--primary)] shadow-lg scale-110' : 'border-gray-200'}`}>
                            {data.isBirthdayPassed && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <input type="checkbox" checked={data.isBirthdayPassed} onChange={e => update('isBirthdayPassed', e.target.checked)} className="hidden" />
                        <span className="text-xs font-black text-gray-400 group-hover:text-[var(--secondary)] transition-colors">생일 지남</span>
                    </label>
                </div>
            </div>

            <div className="space-y-6">
                <label className="input-label">미성년 자녀 수</label>
                <div className="flex items-center gap-10 py-4 justify-between bg-gray-50/50 px-8 rounded-3xl border border-gray-100">
                   <button onClick={() => update('childrenCount', Math.max(0, parseInt(data.childrenCount || '0') - 1).toString())} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><Minus className="w-4 h-4" /></button>
                   <span className="text-5xl font-black text-[var(--secondary)]">{data.childrenCount || '0'}</span>
                   <button onClick={() => update('childrenCount', (parseInt(data.childrenCount || '0') + 1).toString())} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><Plus className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="md:col-span-2 space-y-6">
                <label className="input-label text-center">자산 및 신용 리포트</label>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 px-8 py-6 rounded-3xl border border-gray-100 focus-within:border-[var(--primary)] focus-within:ring-8 focus-within:ring-[var(--accent)] transition-all">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">보유 현금</label>
                        <input type="text" value={data.cash} onChange={e => update('cash', e.target.value)} className="w-full text-2xl font-black bg-transparent outline-none" placeholder="0" />
                        <span className="text-[10px] text-[var(--primary)] font-black uppercase tracking-widest mt-1 block">Credits (KRW)</span>
                    </div>
                    <div className="bg-gray-50 px-8 py-6 rounded-3xl border border-gray-100 focus-within:border-[var(--primary)] focus-within:ring-8 focus-within:ring-[var(--accent)] transition-all">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">월 고정 부채</label>
                        <input type="text" value={data.existingDebtPayment} onChange={e => update('existingDebtPayment', e.target.value)} className="w-full text-2xl font-black bg-transparent outline-none" placeholder="0" />
                        <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest mt-1 block">Debts (KRW)</span>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* 4. Score Cards - Clean & Minimalist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-[var(--apple-shadow)] border border-gray-100 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all duration-500">
              <div className="space-y-2">
                  <label className="input-label mb-0 text-gray-400 uppercase tracking-widest text-xs">NICE Credit Score</label>
                  <input type="text" value={data.niceScore} onChange={e => update('niceScore', e.target.value)} className="text-5xl font-black outline-none w-full bg-transparent" placeholder="000" />
              </div>
              <div className="p-6 rounded-3xl bg-gray-50 group-hover:bg-[var(--accent)] transition-colors">
                  <Trophy className="w-10 h-10 text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
              </div>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-[var(--apple-shadow)] border border-gray-100 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all duration-500">
              <div className="space-y-2">
                  <label className="input-label mb-0 text-gray-400 uppercase tracking-widest text-xs">KCB Credit Score</label>
                  <input type="text" value={data.kcbScore} onChange={e => update('kcbScore', e.target.value)} className="text-5xl font-black outline-none w-full bg-transparent" placeholder="000" />
              </div>
              <div className="p-6 rounded-3xl bg-gray-50 group-hover:bg-[var(--accent)] transition-colors">
                  <Activity className="w-10 h-10 text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
              </div>
          </div>
      </div>

      {/* 5. Logic Icons - Selection Grid */}
      <div className="space-y-12">
        <label className="text-2xl font-black tracking-tighter text-center block">대출 우대 및 적격 여부</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                { key: 'isFirstTimeBuyer', label: '생애최초 주택 구입', icon: Home, desc: '내 집 마련이 처음이신 경우 LTV 우대를 받습니다.' },
                { key: 'isHomeless', label: '무주택 세대주', icon: Key, desc: '세대주 및 세대원 모두 주택이 없는 상태입니다.' },
                { key: 'newbornWithin2Years', label: '2년 내 출산/입양', icon: Baby, desc: '신생아 특례 대출의 가장 핵심적인 요건입니다.' },
                { key: 'wantsGraduatedRepayment', label: '체증식 상환 선호', icon: TrendingUp, desc: '초기 월 상환액을 낮추는 방식을 고려합니다.' },
            ].map(item => (
                <button
                    key={item.key}
                    onClick={() => update(item.key as keyof UserProfileInput, !data[item.key as keyof UserProfileInput])}
                    className={`p-10 rounded-[3.5rem] border-2 text-left transition-all duration-500 flex items-start gap-8 ${
                        data[item.key as keyof UserProfileInput] 
                        ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-2xl scale-[1.02]' 
                        : 'bg-white border-gray-100 hover:border-gray-200 group'
                    }`}
                >
                    <div className={`p-6 rounded-[2rem] shadow-inner transition-colors ${data[item.key as keyof UserProfileInput] ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-[var(--accent)]'}`}>
                        <item.icon className={`w-8 h-8 ${data[item.key as keyof UserProfileInput] ? 'text-[var(--primary)]' : 'text-gray-300 group-hover:text-[var(--primary)]'}`} />
                    </div>
                    <div className="space-y-2 pt-2">
                        <span className="text-2xl font-black block tracking-tighter">{item.label}</span>
                        <p className={`text-sm font-bold opacity-50 ${data[item.key as keyof UserProfileInput] ? 'text-white' : 'text-gray-400'}`}>{item.desc}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* 6. Refinance Section - Ultimate Highlight */}
      <div className="pt-20 border-t-4 border-gray-100 border-dashed">
          <button
            onClick={() => update('hasExistingFirstHomeLoan', !data.hasExistingFirstHomeLoan)}
            className={`w-full p-16 rounded-[4.5rem] border-2 flex items-center justify-between transition-all duration-700 ${
                data.hasExistingFirstHomeLoan 
                ? 'bg-gradient-to-br from-[var(--secondary)] to-black border-black text-white shadow-[0_40px_100px_rgba(0,0,0,0.2)] scale-[1.01]' 
                : 'bg-white border-gray-100 hover:border-gray-200 group'
            }`}
          >
            <div className="flex items-center gap-12">
                <div className={`p-8 rounded-[2.5rem] transition-colors ${data.hasExistingFirstHomeLoan ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-[var(--accent)]'}`}>
                    <RefreshCw className={`w-12 h-12 ${data.hasExistingFirstHomeLoan ? 'text-[var(--primary)] animate-spin-slow' : 'text-gray-200'}`} />
                </div>
                <div className="text-left space-y-2">
                    <span className="text-4xl font-black block tracking-tighter">기존 정책 대출 보유 중 (갈아타기)</span>
                    <span className={`text-sm font-black uppercase tracking-widest ${data.hasExistingFirstHomeLoan ? 'text-[var(--primary)]' : 'text-gray-300'}`}>Refinancing / Strategy Mode</span>
                </div>
            </div>
            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${data.hasExistingFirstHomeLoan ? 'bg-white text-[var(--secondary)] border-white rotate-90 scale-125' : 'border-gray-100 text-gray-100'}`}>
                {data.hasExistingFirstHomeLoan && <div className="w-3 h-3 bg-[var(--primary)] rounded-full" />}
            </div>
          </button>

          <AnimatePresence>
              {data.hasExistingFirstHomeLoan && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -20 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -20 }}
                    className="overflow-hidden mt-10"
                  >
                        <div className="bg-[var(--secondary)] rounded-[3rem] p-12 space-y-8">
                            <div>
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 block mb-4">Current Loan Balance</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={data.existingFirstHomeLoanBalance}
                                        onChange={(e) => update('existingFirstHomeLoanBalance', e.target.value)}
                                        className="w-full bg-white/5 border-b-2 border-white/20 text-white text-5xl font-black py-6 outline-none focus:border-[var(--primary)] transition-all"
                                        placeholder="0"
                                    />
                                    <div className="absolute right-0 bottom-6 text-2xl font-black text-white/20">만원</div>
                                </div>
                            </div>
                            <div className="bg-[var(--primary)]/10 p-8 rounded-3xl border border-[var(--primary)]/20">
                                <p className="text-sm text-[var(--primary)] font-black leading-relaxed flex items-start gap-3">
                                    <span>⚠️</span>
                                    부채 갈아타기 시에는 기존 대출 잔액을 전량 상환하는 구조로 계산됩니다. LTV 한도와 기존 잔액을 비교하며 자폭 차이를 분석 리포트에 표시해 드립니다.
                                </p>
                            </div>
                        </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    </div>
  );
}
