'use client';

import { UserProfileInput, MarriageStatus, JobType } from '@/types';
import { parseNumber, formatCurrencyKorean } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: UserProfileInput;
  onChange: (data: UserProfileInput) => void;
}

const JOB_OPTIONS: { value: JobType; label: string; icon: string }[] = [
  { value: 'employee', label: '직장인', icon: '🏢' },
  { value: 'selfEmployed', label: '자영업자', icon: '🏪' },
  { value: 'freelancer', label: '프리랜서', icon: '💻' }
];

const MARRIAGE_OPTIONS: { value: MarriageStatus; label: string; sub: string }[] = [
  { value: 'single', label: '미혼', sub: 'Single' },
  { value: 'newlywed', label: '신혼/예정', sub: 'Newlywed' },
  { value: 'married', label: '기혼', sub: 'Married' }
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
    <div className="space-y-16">
      {/* 1. Marriage Status Section - Apple Store Style Selectors */}
      <div className="space-y-6">
        <label className="input-label text-center block text-sm mb-6">혼인 상태를 선택하세요</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MARRIAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('marriageStatus', opt.value)}
              className={`p-6 rounded-[2rem] text-left transition-all border-2 flex flex-col gap-1 ${
                data.marriageStatus === opt.value
                  ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-2xl ring-4 ring-[var(--accent)]/50 scale-[1.02]'
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
              }`}
            >
              <span className="text-xl font-black">{opt.label}</span>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${data.marriageStatus === opt.value ? 'text-white/60' : 'text-gray-300'}`}>
                {opt.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Me & Spouse Side-by-Side Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* MY PROFILE */}
        <div className="bg-gray-50/50 rounded-[3rem] p-8 border border-gray-100 space-y-8">
           <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-black text-xs">01</span>
              <h3 className="text-lg font-black tracking-tighter text-[var(--secondary)]">본인 프로필</h3>
           </div>
           
           <div className="space-y-6">
              <div>
                <label className="input-label">본인 연소득 (만원)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.myIncome}
                  onChange={(e) => update('myIncome', e.target.value)}
                  className="premium-input bg-white text-2xl"
                  placeholder="예: 5500"
                />
                {renderMoney(data.myIncome) && <p className="mt-2 text-sm text-[var(--primary)] font-black">{renderMoney(data.myIncome)}</p>}
              </div>

              <div className="space-y-4">
                <label className="input-label">직업 형태</label>
                <div className="grid grid-cols-3 gap-2">
                   {JOB_OPTIONS.map(opt => (
                     <button
                        key={opt.value}
                        onClick={() => update('jobType', opt.value)}
                        className={`py-4 rounded-2xl flex flex-col items-center gap-1 transition-all border ${
                           data.jobType === opt.value 
                           ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg' 
                           : 'bg-white text-gray-400 border-gray-100'
                        }`}
                     >
                        <span className="text-lg">{opt.icon}</span>
                        <span className="text-[10px] font-black">{opt.label}</span>
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
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className={`rounded-[3rem] p-8 border transition-all space-y-8 ${
                  isMarried ? 'bg-[var(--accent)]/40 border-[var(--primary)]/30 shadow-xl' : 'bg-gray-50/30 border-dashed border-gray-200 opacity-60'
               }`}
            >
               <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${isMarried ? 'bg-[var(--primary)] text-white' : 'bg-gray-300 text-white'}`}>02</span>
                  <h3 className={`text-lg font-black tracking-tighter ${isMarried ? 'text-[var(--secondary)]' : 'text-gray-400'}`}>배우자 프로필</h3>
               </div>
               
               {!isMarried ? (
                   <div className="py-20 text-center">
                       <p className="text-gray-400 font-bold text-sm">미혼인 경우 입력이 불필요합니다.</p>
                       <p className="text-[10px] text-gray-300 font-medium mt-1">Status: Single</p>
                   </div>
               ) : (
                   <div className="space-y-6">
                        <div>
                            <label className="input-label">배우자 연소득 (만원)</label>
                            <input
                            type="text"
                            inputMode="numeric"
                            value={data.spouseIncome}
                            onChange={(e) => update('spouseIncome', e.target.value)}
                            className="premium-input bg-white text-2xl"
                            placeholder="예: 3000"
                            />
                            {renderMoney(data.spouseIncome) && <p className="mt-2 text-sm text-[var(--primary)] font-black">{renderMoney(data.spouseIncome)}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="input-label">배우자 직업 형태</label>
                            <div className="grid grid-cols-3 gap-2">
                            {JOB_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => update('spouseJobType', opt.value)}
                                    className={`py-4 rounded-2xl flex flex-col items-center gap-1 transition-all border ${
                                    data.spouseJobType === opt.value 
                                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg' 
                                    : 'bg-white text-gray-400 border-gray-100'
                                    }`}
                                >
                                    <span className="text-lg">{opt.icon}</span>
                                    <span className="text-[10px] font-black">{opt.label}</span>
                                </button>
                            ))}
                            </div>
                        </div>
                   </div>
               )}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Household Context - Grid Layout */}
      <div className="bg-gray-50/50 rounded-[3rem] p-10 border border-gray-100">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
                <label className="input-label">나이 (연 나이)</label>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.age}
                        onChange={(e) => update('age', e.target.value)}
                        className="premium-input bg-white text-center text-4xl py-6"
                        placeholder="33"
                    />
                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.isBirthdayPassed} onChange={e => update('isBirthdayPassed', e.target.checked)} className="w-4 h-4" />
                            <span className="text-[10px] font-black text-gray-400">생짐</span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label className="input-label">자녀 수</label>
                <div className="flex items-center justify-center gap-6 py-4">
                   <button onClick={() => update('childrenCount', Math.max(0, parseInt(data.childrenCount || '0') - 1).toString())} className="w-12 h-12 rounded-full bg-white border border-gray-200 font-black">-</button>
                   <span className="text-4xl font-black">{data.childrenCount || '0'}</span>
                   <button onClick={() => update('childrenCount', (parseInt(data.childrenCount || '0') + 1).toString())} className="w-12 h-12 rounded-full bg-white border border-gray-200 font-black">+</button>
                </div>
            </div>

            <div className="md:col-span-2 space-y-4">
                <label className="input-label text-center">자산 및 신용 상태</label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <label className="text-[8px] font-black uppercase text-gray-300 block mb-1">보유 현금</label>
                        <input type="text" value={data.cash} onChange={e => update('cash', e.target.value)} className="w-full text-lg font-black outline-none" placeholder="예: 10000" />
                        <span className="text-[9px] text-[var(--primary)] font-bold">{renderMoney(data.cash)}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <label className="text-[8px] font-black uppercase text-gray-300 block mb-1">고정 부채 상환</label>
                        <input type="text" value={data.existingDebtPayment} onChange={e => update('existingDebtPayment', e.target.value)} className="w-full text-lg font-black outline-none" placeholder="예: 120" />
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* 4. Score Info - Sliders or Quick Select */}
      <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
              <div>
                  <label className="input-label mb-0">NICE 점수</label>
                  <input type="text" value={data.niceScore} onChange={e => update('niceScore', e.target.value)} className="text-2xl font-black outline-none w-24" placeholder="850" />
              </div>
              <div className="text-3xl grayscale opacity-20">🎯</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
              <div>
                  <label className="input-label mb-0">KCB 점수</label>
                  <input type="text" value={data.kcbScore} onChange={e => update('kcbScore', e.target.value)} className="text-2xl font-black outline-none w-24" placeholder="790" />
              </div>
              <div className="text-3xl grayscale opacity-20">📊</div>
          </div>
      </div>

      {/* 5. Policy Options - Giant Selection Tiles */}
      <div className="space-y-6">
        <label className="input-label text-center block">적격 대출 및 가산점 항목</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { key: 'isFirstTimeBuyer', label: '생애최초 구입', icon: '🏠' },
                { key: 'isHomeless', label: '무주택 세대주', icon: '🔑' },
                { key: 'newbornWithin2Years', label: '2년 내 출산', icon: '🍼' },
                { key: 'wantsGraduatedRepayment', label: '체증식 선호', icon: '📈' },
            ].map(item => (
                <button
                    key={item.key}
                    onClick={() => update(item.key as keyof UserProfileInput, !data[item.key as keyof UserProfileInput])}
                    className={`p-10 rounded-[2.5rem] border-2 flex items-center justify-between transition-all ${
                        data[item.key as keyof UserProfileInput] 
                        ? 'bg-[var(--accent)] border-[var(--primary)] ring-4 ring-[var(--accent)]' 
                        : 'bg-white border-gray-100 hover:border-gray-300'
                    }`}
                >
                    <div className="flex items-center gap-6">
                        <span className="text-4xl">{item.icon}</span>
                        <div className="text-left">
                            <span className="text-2xl font-black block">{item.label}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Policy Eligibility</span>
                        </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${data[item.key as keyof UserProfileInput] ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-200'}`}>
                        {data[item.key as keyof UserProfileInput] && '✓'}
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* 6. Refinance Section - High Highlight */}
      <div className="pt-10 border-t border-gray-100">
          <button
            onClick={() => update('hasExistingFirstHomeLoan', !data.hasExistingFirstHomeLoan)}
            className={`w-full p-10 rounded-[3rem] border-2 flex items-center justify-between transition-all ${
                data.hasExistingFirstHomeLoan 
                ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-2xl scale-[1.01]' 
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className="flex items-center gap-8">
                <span className="text-5xl">🔄</span>
                <div className="text-left">
                    <span className="text-3xl font-black block tracking-tighter">기존 정책 대출 보유</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Refinancing / Switch Loan</span>
                </div>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${data.hasExistingFirstHomeLoan ? 'bg-white text-[var(--secondary)] border-white' : 'border-gray-300'}`}>
                {data.hasExistingFirstHomeLoan && '✓'}
            </div>
          </button>

          <AnimatePresence>
              {data.hasExistingFirstHomeLoan && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-6 px-10"
                  >
                        <label className="input-label text-[var(--secondary)]">기존 대출 잔액 (만원)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={data.existingFirstHomeLoanBalance}
                            onChange={(e) => update('existingFirstHomeLoanBalance', e.target.value)}
                            className="premium-input bg-gray-50 border-[var(--secondary)]/20 text-3xl font-black"
                            placeholder="예: 25000"
                        />
                        <p className="mt-4 text-[11px] text-[var(--secondary)] font-bold opacity-70 leading-relaxed">
                            ⚠️ 갈아타기 시에는 기존 대출의 대환 목적으로만 한도를 추정하며, 결과 리포트에 안내가 포함됩니다.
                        </p>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    </div>
  );
}
