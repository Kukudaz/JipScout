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
    <div className="space-y-20">
      {/* 1. Marriage Status Section */}
      <div className="space-y-8 text-center">
        <label className="text-xl md:text-2xl font-black tracking-tighter block mb-8 whitespace-nowrap">현재 혼인 상태는 어떠신가요?</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {MARRIAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('marriageStatus', opt.value)}
              className={`pro-tile h-32 md:h-40 ${
                data.marriageStatus === opt.value
                  ? 'pro-tile-active'
                  : 'pro-tile-inactive'
              }`}
            >
              <opt.icon className={`w-8 h-8 ${data.marriageStatus === opt.value ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
              <div className="flex flex-col gap-1">
                <span className="text-xl md:text-2xl font-black tracking-tighter whitespace-nowrap">{opt.label}</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{opt.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Me & Spouse Side-by-Side Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* MY PROFILE */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[var(--apple-shadow)] border border-gray-100 space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-md">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tighter text-[var(--secondary)] whitespace-nowrap">본인 상세 프로필</h3>
           </div>
           
           <div className="space-y-8">
              <div>
                <label className="input-label text-sm uppercase tracking-widest text-gray-400">본인 연소득 (만원)</label>
                <div className="relative group">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.myIncome}
                        onChange={(e) => update('myIncome', e.target.value)}
                        className="premium-input text-3xl py-8"
                        placeholder="0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-gray-200">만원</div>
                </div>
                {renderMoney(data.myIncome) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-base text-[var(--primary)] font-black text-right">
                        {renderMoney(data.myIncome)}
                    </motion.p>
                )}
              </div>

              <div className="space-y-4">
                <label className="input-label text-sm uppercase tracking-widest text-gray-400">본인 직업 형태</label>
                <div className="grid grid-cols-3 gap-3">
                   {JOB_OPTIONS.map(opt => (
                     <button
                        key={opt.value}
                        onClick={() => update('jobType', opt.value)}
                        className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${
                           data.jobType === opt.value 
                           ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-lg' 
                           : 'bg-white text-gray-400 border-gray-100'
                        }`}
                     >
                        <opt.icon className={`w-5 h-5 ${data.jobType === opt.value ? 'text-[var(--primary)]' : 'text-gray-100'}`} />
                        <span className="text-[11px] font-black tracking-tight whitespace-nowrap">{opt.label}</span>
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
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className={`rounded-[3rem] p-8 md:p-12 border-2 transition-all space-y-10 ${
                  isMarried 
                  ? 'bg-white shadow-[var(--apple-shadow)] border-gray-100' 
                  : 'bg-gray-50/50 border-dashed border-gray-200 opacity-40 grayscale'
               }`}
            >
               <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${isMarried ? 'bg-[var(--primary)] text-white' : 'bg-gray-200 text-white'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className={`text-xl md:text-2xl font-black tracking-tighter whitespace-nowrap ${isMarried ? 'text-[var(--secondary)]' : 'text-gray-400'}`}>배우자 상세 프로필</h3>
               </div>
               
               {!isMarried ? (
                   <div className="py-20 text-center">
                       <p className="text-gray-400 font-black">미혼 상태입니다.</p>
                       <p className="text-[10px] text-gray-300 font-black mt-1 uppercase tracking-widest">Profile Locked</p>
                   </div>
               ) : (
                   <div className="space-y-8">
                        <div>
                            <label className="input-label text-sm uppercase tracking-widest text-gray-400">배우자 연소득 (만원)</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={data.spouseIncome}
                                    onChange={(e) => update('spouseIncome', e.target.value)}
                                    className="premium-input text-3xl py-8"
                                    placeholder="0"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-gray-200">만원</div>
                            </div>
                            {renderMoney(data.spouseIncome) && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-base text-[var(--primary)] font-black text-right">
                                    {renderMoney(data.spouseIncome)}
                                </motion.p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="input-label text-sm uppercase tracking-widest text-gray-400">배우자 직업 형태</label>
                            <div className="grid grid-cols-3 gap-3">
                            {JOB_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => update('spouseJobType', opt.value)}
                                    className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${
                                    data.spouseJobType === opt.value 
                                    ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-lg' 
                                    : 'bg-white text-gray-400 border-gray-100'
                                    }`}
                                >
                                    <opt.icon className={`w-5 h-5 ${data.spouseJobType === opt.value ? 'text-[var(--primary)]' : 'text-gray-100'}`} />
                                    <span className="text-[11px] font-black tracking-tight whitespace-nowrap">{opt.label}</span>
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
      <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[var(--apple-shadow)] border border-gray-100">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-4">
                <label className="input-label flex items-center gap-2 whitespace-nowrap text-lg">
                    <Activity className="w-5 h-5 text-[var(--primary)]" /> 만 나이
                </label>
                <div className="flex flex-col items-center gap-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.age}
                        onChange={(e) => update('age', e.target.value)}
                        className="premium-input text-center text-4xl py-6 w-full"
                        placeholder="33"
                    />
                    <label className="flex items-center gap-3 cursor-pointer group w-full py-2 px-4 bg-gray-50 rounded-xl border border-gray-100/50 hover:bg-white transition-colors">
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${data.isBirthdayPassed ? 'bg-[var(--primary)] border-[var(--primary)] shadow-sm' : 'border-gray-200'}`}>
                            {data.isBirthdayPassed && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <input type="checkbox" checked={data.isBirthdayPassed} onChange={e => update('isBirthdayPassed', e.target.checked)} className="hidden" />
                        <span className="text-[10px] font-black text-gray-400 group-hover:text-[var(--secondary)] whitespace-nowrap uppercase tracking-widest">Birthday Passed</span>
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <label className="input-label whitespace-nowrap text-lg">미성년 자녀 수</label>
                <div className="flex items-center gap-6 py-4 justify-between bg-gray-50/50 px-6 rounded-2xl border border-gray-100 h-[100px]">
                   <button onClick={() => update('childrenCount', Math.max(0, parseInt(data.childrenCount || '0') - 1).toString())} className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 transition-all"><Minus className="w-4 h-4" /></button>
                   <span className="text-4xl font-black text-[var(--secondary)]">{data.childrenCount || '0'}</span>
                   <button onClick={() => update('childrenCount', (parseInt(data.childrenCount || '0') + 1).toString())} className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 transition-all"><Plus className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="md:col-span-2 space-y-4">
                <label className="input-label whitespace-nowrap text-lg">자산 및 신용 리포트</label>
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-gray-50 px-6 py-6 rounded-2xl border border-gray-100">
                        <label className="text-xs font-black uppercase text-gray-400 block mb-2">보유 현금</label>
                        <input type="text" value={data.cash} onChange={e => update('cash', e.target.value)} className="w-full text-2xl font-black bg-transparent outline-none" placeholder="0" />
                        {renderMoney(data.cash) && <p className="text-[10px] text-[var(--primary)] font-black mt-1">{renderMoney(data.cash)}</p>}
                    </div>
                    <div className="bg-gray-50 px-6 py-6 rounded-2xl border border-gray-100">
                        <label className="text-xs font-black uppercase text-gray-400 block mb-2">월 부채</label>
                        <input type="text" value={data.existingDebtPayment} onChange={e => update('existingDebtPayment', e.target.value)} className="w-full text-2xl font-black bg-transparent outline-none" placeholder="0" />
                        {renderMoney(data.existingDebtPayment) && <p className="text-[10px] text-gray-300 font-black mt-1">{renderMoney(data.existingDebtPayment)}</p>}
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* 4. Score Cards - Clean & Minimalist */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[var(--apple-shadow)] border border-gray-100 flex items-center justify-between group">
              <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">NICE Score</label>
                  <input type="text" value={data.niceScore} onChange={e => update('niceScore', e.target.value)} className="text-3xl md:text-5xl font-black outline-none w-full bg-transparent" placeholder="000" />
              </div>
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-gray-200 group-hover:text-[var(--primary)] transition-colors hidden sm:block" />
          </div>
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[var(--apple-shadow)] border border-gray-100 flex items-center justify-between group">
              <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">KCB Score</label>
                  <input type="text" value={data.kcbScore} onChange={e => update('kcbScore', e.target.value)} className="text-3xl md:text-5xl font-black outline-none w-full bg-transparent" placeholder="000" />
              </div>
              <Activity className="w-8 h-8 md:w-10 md:h-10 text-gray-200 group-hover:text-[var(--primary)] transition-colors hidden sm:block" />
          </div>
      </div>

      {/* 5. Policy Icons - Compact Selection Grid */}
      <div className="space-y-8">
        <label className="text-xl md:text-2xl font-black tracking-tighter text-center block whitespace-nowrap">대출 우대 및 적격 여부</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { key: 'isFirstTimeBuyer', label: '생애최초 주택 구입', icon: Home, desc: '내 집 마련이 처음인 경우 LTV 우대' },
                { key: 'isHomeless', label: '무주택 세대주', icon: Key, desc: '세대원 전체 주택 무소유 상태' },
                { key: 'newbornWithin2Years', label: '2년 내 출산/입양', icon: Baby, desc: '신생아 특례 대출 핵심 요건' },
                { key: 'wantsGraduatedRepayment', label: '체증식 상환 선호', icon: TrendingUp, desc: '초기 월 상환액을 낮추는 방식' },
            ].map(item => (
                <button
                    key={item.key}
                    onClick={() => update(item.key as keyof UserProfileInput, !data[item.key as keyof UserProfileInput])}
                    className={`p-6 rounded-[2.5rem] border-2 text-left transition-all duration-500 flex items-center gap-5 ${
                        data[item.key as keyof UserProfileInput] 
                        ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-xl scale-[1.01]' 
                        : 'bg-white border-gray-100 hover:border-gray-200 group'
                    }`}
                >
                    <div className={`p-4 rounded-2xl shrink-0 transition-colors ${data[item.key as keyof UserProfileInput] ? 'bg-white/10' : 'bg-gray-50'}`}>
                        <item.icon className={`w-6 h-6 ${data[item.key as keyof UserProfileInput] ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
                    </div>
                    <div className="min-w-0">
                        <span className="text-base md:text-lg font-black block tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                        <p className={`text-[10px] font-bold opacity-50 truncate ${data[item.key as keyof UserProfileInput] ? 'text-white' : 'text-gray-400'}`}>{item.desc}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* 6. Refinance Section */}
      <div className="pt-12 border-t-4 border-gray-100 border-dashed">
          <button
            onClick={() => update('hasExistingFirstHomeLoan', !data.hasExistingFirstHomeLoan)}
            className={`w-full p-8 md:p-12 rounded-[3.5rem] border-2 flex items-center justify-between transition-all duration-500 ${
                data.hasExistingFirstHomeLoan 
                ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-2xl scale-[1.01]' 
                : 'bg-white border-gray-100 group'
            }`}
          >
            <div className="flex items-center gap-6 text-left">
                <div className={`p-6 rounded-2xl transition-colors ${data.hasExistingFirstHomeLoan ? 'bg-white/10' : 'bg-gray-50'}`}>
                    <RefreshCw className={`w-8 h-8 ${data.hasExistingFirstHomeLoan ? 'text-[var(--primary)] ' : 'text-gray-100'}`} />
                </div>
                <div>
                    <span className="text-xl md:text-2xl font-black block tracking-tighter whitespace-nowrap">기존 정책 대출 보유 중 (갈아타기)</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${data.hasExistingFirstHomeLoan ? 'text-[var(--primary)]' : 'text-gray-200'}`}>Refinance Mode</span>
                </div>
            </div>
            <div className={`w-8 h-8 rounded-full border-4 transition-all hidden sm:flex shrink-0 ${data.hasExistingFirstHomeLoan ? 'bg-white border-white' : 'border-gray-100'}`} />
          </button>
      </div>
    </div>
  );
}
