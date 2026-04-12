'use client';

import { UserProfileInput, MarriageStatus, JobType } from '@/types';
import { parseNumber, formatCurrencyKorean } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: UserProfileInput;
  onChange: (data: UserProfileInput) => void;
}

const JOB_LABELS: Record<JobType, string> = {
  employee: '직장인',
  selfEmployed: '자영업자',
  freelancer: '프리랜서/기타'
};

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
    <div className="space-y-12">
      {/* 1. Marriage Status - The Core Filter */}
      <div className="space-y-4">
        <label className="input-label text-center block text-lg mb-6">혼인 상태를 선택해주세요.</label>
        <div className="grid grid-cols-3 gap-3">
          {(['single', 'newlywed', 'married'] as MarriageStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => update('marriageStatus', status)}
              className={`py-4 rounded-2xl text-xs font-black transition-all border-2 ${
                data.marriageStatus === status
                  ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-lg scale-[1.02]'
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
              }`}
            >
              {status === 'single' ? '미혼' : status === 'newlywed' ? '신혼/결혼예정' : '기혼'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Me & Spouse Financial Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Me Section */}
        <div className="space-y-6 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
           <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-black">MY</div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--secondary)]">본인 프로필</h3>
           </div>
           
           <div className="space-y-4">
              <div>
                <label className="input-label">연소득 (만원)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.myIncome}
                  onChange={(e) => update('myIncome', e.target.value)}
                  className="premium-input bg-white"
                  placeholder="예: 5000"
                />
                {renderMoney(data.myIncome) && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.myIncome)}</p>}
              </div>
              
              <div>
                <label className="input-label">본인 직업 형태</label>
                <div className="grid grid-cols-3 gap-2">
                    {(['employee', 'selfEmployed', 'freelancer'] as JobType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => update('jobType', type)}
                            className={`py-3 rounded-xl text-[10px] font-black transition-all border ${
                                data.jobType === type
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                : 'bg-white text-gray-400 border-gray-100'
                            }`}
                        >
                            {JOB_LABELS[type]}
                        </button>
                    ))}
                </div>
              </div>
           </div>
        </div>

        {/* Spouse Section */}
        <motion.div 
            animate={{ opacity: isMarried ? 1 : 0.4 }}
            className={`space-y-6 p-6 rounded-[2rem] border transition-colors ${
                isMarried ? 'bg-[var(--accent)]/30 border-[var(--primary)]/20 shadow-xl' : 'bg-gray-50 border-gray-100 grayscale'
            }`}
        >
           <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black ${isMarried ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}>WE</div>
                <h3 className={`text-sm font-black uppercase tracking-widest ${isMarried ? 'text-[var(--secondary)]' : 'text-gray-400'}`}>배우자 프로필</h3>
           </div>

           <div className="space-y-4">
              <div>
                <label className="input-label">연소득 (만원)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.spouseIncome}
                  onChange={(e) => update('spouseIncome', e.target.value)}
                  className="premium-input bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="예: 3000"
                  disabled={!isMarried}
                />
                {isMarried && renderMoney(data.spouseIncome) && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.spouseIncome)}</p>}
              </div>

              <div>
                <label className="input-label">배우자 직업 형태</label>
                <div className="grid grid-cols-3 gap-2">
                    {(['employee', 'selfEmployed', 'freelancer'] as JobType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => isMarried && update('spouseJobType', type)}
                            className={`py-3 rounded-xl text-[10px] font-black transition-all border ${
                                isMarried && data.spouseJobType === type
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                : 'bg-white text-gray-400 border-gray-100'
                            } ${!isMarried && 'text-gray-200 cursor-not-allowed'}`}
                            disabled={!isMarried}
                        >
                            {JOB_LABELS[type]}
                        </button>
                    ))}
                </div>
              </div>
           </div>
        </motion.div>
      </div>

      {/* 3. Household Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="input-label">나이 (전국 기준)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.age}
            onChange={(e) => update('age', e.target.value)}
            className="premium-input"
            placeholder="예: 33"
          />
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={data.isBirthdayPassed}
              onChange={(e) => update('isBirthdayPassed', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-[10px] text-gray-500 font-bold">생일 지남 (만 나이 정밀 계산)</span>
          </label>
        </div>
        <div>
          <label className="input-label">자녀 수</label>
          <div className="flex items-center gap-3">
             <button onClick={() => update('childrenCount', Math.max(0, parseInt(data.childrenCount || '0') - 1).toString())} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center font-black">-</button>
             <input
                type="text"
                inputMode="numeric"
                value={data.childrenCount}
                onChange={(e) => update('childrenCount', e.target.value)}
                className="w-16 text-center text-lg font-black bg-transparent outline-none"
             />
             <button onClick={() => update('childrenCount', (parseInt(data.childrenCount || '0') + 1).toString())} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center font-black">+</button>
          </div>
        </div>
        <div className="space-y-4 pt-6">
           {/* Move additional scores here if needed, or keep for aesthetics */}
        </div>
      </div>

      {/* 4. Assets & Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
         <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">자산 현황</h4>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="input-label">보유 현금 (만원)</label>
                    <input
                    type="text"
                    inputMode="numeric"
                    value={data.cash}
                    onChange={(e) => update('cash', e.target.value)}
                    className="premium-input"
                    placeholder="현금, 예적금 등 합계"
                    />
                    {renderMoney(data.cash) && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.cash)}</p>}
                </div>
                <div>
                    <label className="input-label">기존 월 부채 상환액 (만원)</label>
                    <input
                    type="text"
                    inputMode="numeric"
                    value={data.existingDebtPayment}
                    onChange={(e) => update('existingDebtPayment', e.target.value)}
                    className="premium-input"
                    placeholder="신용대출 등 고정 부채 상환액"
                    />
                </div>
            </div>
         </div>
         <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">신용 상태</h4>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="input-label">NICE 점수</label>
                    <input
                    type="text"
                    inputMode="numeric"
                    value={data.niceScore}
                    onChange={(e) => update('niceScore', e.target.value)}
                    className="premium-input"
                    placeholder="예: 850"
                    />
                </div>
                <div>
                    <label className="input-label">KCB 점수</label>
                    <input
                    type="text"
                    inputMode="numeric"
                    value={data.kcbScore}
                    onChange={(e) => update('kcbScore', e.target.value)}
                    className="premium-input"
                    placeholder="예: 790"
                    />
                </div>
            </div>
         </div>
      </div>

      {/* 5. Selection Tiles (Apple Style) */}
      <div className="space-y-6 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">추가 정책 옵션</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'isFirstTimeBuyer', label: '생애최초 구입', desc: '더 높은 LTV와 낮은 금리가 적용될 수 있습니다.' },
            { key: 'isHomeless', label: '무주택 세대주', desc: '정책 대출 자격 요건의 핵심입니다.' },
            { key: 'newbornWithin2Years', label: '2년 내 출산/입양', desc: '신생아 특례 대출 자격을 확인합니다.' },
            { key: 'wantsGraduatedRepayment', label: '체증식 상환 선호', desc: '초기에 적게 내는 상환 방식을 고려합니다.' },
          ].map((item) => (
            <button
               key={item.key}
               onClick={() => update(item.key as keyof UserProfileInput, !data[item.key as keyof UserProfileInput])}
               className={`p-6 rounded-3xl text-left transition-all border-2 flex flex-col gap-2 ${
                 data[item.key as keyof UserProfileInput]
                   ? 'bg-[var(--accent)] border-[var(--primary)]'
                   : 'bg-white border-gray-100 hover:border-gray-200'
               }`}
            >
                <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-black text-[var(--secondary)]">{item.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${data[item.key as keyof UserProfileInput] ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-200'}`}>
                        {data[item.key as keyof UserProfileInput] && '✓'}
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Refinance Restoration */}
      <div className="pt-8 border-t border-gray-100">
         <button
            onClick={() => update('hasExistingFirstHomeLoan', !data.hasExistingFirstHomeLoan)}
            className={`w-full p-6 h-auto rounded-3xl text-left border-2 flex items-center justify-between transition-all ${
                data.hasExistingFirstHomeLoan ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-xl' : 'bg-gray-50 border-gray-100'
            }`}
         >
            <div className="flex flex-col gap-1">
                <span className="text-sm font-black uppercase tracking-tighter">기존 정책 대출 보유 (갈아타기)</span>
                <p className={`text-[10px] ${data.hasExistingFirstHomeLoan ? 'text-white/60' : 'text-gray-400'}`}>보유 중인 대출을 저금리 신규 대출로 갈아타기를 희망합니다.</p>
            </div>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${data.hasExistingFirstHomeLoan ? 'bg-white text-[var(--secondary)] border-white' : 'border-gray-300 text-gray-300'}`}>
                {data.hasExistingFirstHomeLoan && '✓'}
            </div>
         </button>
         
         <AnimatePresence>
            {data.hasExistingFirstHomeLoan && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 space-y-4"
                >
                    <label className="input-label">기존 대출 잔액 (만원)</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.existingFirstHomeLoanBalance}
                        onChange={(e) => update('existingFirstHomeLoanBalance', e.target.value)}
                        className="premium-input bg-white text-[var(--secondary)]"
                        placeholder="예: 25000"
                    />
                    <div className="bg-[var(--secondary)]/5 p-4 rounded-2xl flex gap-3 items-start">
                        <span className="text-lg">ℹ️</span>
                        <p className="text-[10px] text-[var(--secondary)] leading-relaxed font-bold">
                            갈아타기 시에는 기존 대출 잔액을 상환하는 용도로만 대출이 실행됩니다. LTV 한도가 기존 잔액보다 작을 경우 추가 자금이 필요할 수 있습니다.
                        </p>
                    </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
