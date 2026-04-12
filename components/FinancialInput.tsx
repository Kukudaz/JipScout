'use client';

import { UserProfileInput, MarriageStatus, JobType } from '@/types';
import { parseNumber, formatCurrencyKorean } from '@/lib/format';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: UserProfileInput;
  onChange: (data: UserProfileInput) => void;
}

export default function FinancialInput({ data, onChange }: Props) {
  const update = <K extends keyof UserProfileInput>(key: K, value: UserProfileInput[K]) => {
    onChange({ ...data, [key]: value });
  };

  const renderMoney = (val: string) => {
    const num = parseNumber(val);
    return num > 0 ? formatCurrencyKorean(num) : '';
  };

  const renderNumber = (val: string, suffix: string) => {
    const num = parseNumber(val);
    return num > 0 ? `${num}${suffix}` : '';
  };

  const isMarried = data.marriageStatus !== 'single';

  return (
    <div className="space-y-8">
      {/* 1. Basic Bio Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="input-label">나이 (연 나이)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.age}
            onChange={(e) => update('age', e.target.value)}
            className="premium-input"
            placeholder="예: 33"
          />
          {renderNumber(data.age, '세') && <p className="mt-1 text-xs text-[var(--primary)] font-bold mb-2">{renderNumber(data.age, '세')}</p>}
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={data.isBirthdayPassed}
              onChange={(e) => update('isBirthdayPassed', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-xs text-gray-500 font-medium">올해 생일 지남 (만 나이 계산용)</span>
          </label>
        </div>
        <div>
          <label className="input-label">자녀 수</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.childrenCount}
            onChange={(e) => update('childrenCount', e.target.value)}
            className="premium-input"
            placeholder="예: 1"
          />
          {renderNumber(data.childrenCount, '명') && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderNumber(data.childrenCount, '명')}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="input-label">직업 형태</label>
          <select
            value={data.jobType}
            onChange={(e) => update('jobType', e.target.value as JobType)}
            className="premium-input"
          >
            <option value="employee">직장인</option>
            <option value="selfEmployed">자영업자</option>
            <option value="freelancer">프리랜서 또는 기타</option>
          </select>
        </div>
        <div>
          <label className="input-label">혼인 상태</label>
          <select
            value={data.marriageStatus}
            onChange={(e) => update('marriageStatus', e.target.value as MarriageStatus)}
            className="premium-input"
          >
            <option value="single">미혼</option>
            <option value="newlywed">신혼 또는 결혼예정</option>
            <option value="married">기혼</option>
          </select>
        </div>
      </div>

      {/* 2. Income Info (Conditional Spouse info) */}
      <div className="space-y-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="input-label">본인 연소득 (만원)</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.myIncome}
              onChange={(e) => update('myIncome', e.target.value)}
              className="premium-input"
              placeholder="예: 5000"
            />
            {renderMoney(data.myIncome) && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.myIncome)}</p>}
          </div>
          
          <AnimatePresence>
            {isMarried && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <label className="input-label text-[var(--primary)]">배우자 연소득 (만원)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.spouseIncome}
                  onChange={(e) => update('spouseIncome', e.target.value)}
                  className="premium-input border-[var(--primary)]/30 focus:border-[var(--primary)]"
                  placeholder="예: 3000"
                />
                {renderMoney(data.spouseIncome) && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.spouseIncome)}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isMarried && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pb-4"
            >
              <label className="input-label text-[var(--primary)]">배우자 직업 형태</label>
              <select
                value={data.spouseJobType}
                onChange={(e) => update('spouseJobType', e.target.value as JobType)}
                className="premium-input border-[var(--primary)]/30 focus:border-[var(--primary)]"
              >
                <option value="employee">직장인</option>
                <option value="selfEmployed">자영업자</option>
                <option value="freelancer">프리랜서 또는 기타</option>
              </select>
              <p className="mt-2 text-[10px] text-gray-500 leading-relaxed">
                부부 합산 소득과 배우자의 직업 형태는 정부 대출(디딤돌, 신생아 등) 자격 판정 및 체증식 상환 가능성 검토에 필수적입니다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Debt & Cash */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
        <div>
          <label className="input-label">보유 현금 (만원)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.cash}
            onChange={(e) => update('cash', e.target.value)}
            className="premium-input"
            placeholder="예: 10000"
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
            placeholder="예: 120"
          />
          {renderMoney(data.existingDebtPayment) && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.existingDebtPayment)}</p>}
        </div>
      </div>

      {/* 4. Score Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="input-label">NICE 점수 (선택)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.niceScore}
            onChange={(e) => update('niceScore', e.target.value)}
            className="premium-input"
            placeholder="예: 820"
          />
          {renderNumber(data.niceScore, '점') && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderNumber(data.niceScore, '점')}</p>}
        </div>
        <div>
          <label className="input-label">KCB 점수 (선택)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.kcbScore}
            onChange={(e) => update('kcbScore', e.target.value)}
            className="premium-input"
            placeholder="예: 760"
          />
          {renderNumber(data.kcbScore, '점') && <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderNumber(data.kcbScore, '점')}</p>}
        </div>
      </div>

      {/* 5. Special Options */}
      <div className="flex flex-wrap gap-3 py-4">
        {[
          { key: 'isFirstTimeBuyer', label: '생애최초 구입' },
          { key: 'isHomeless', label: '무주택 세대주' },
          { key: 'newbornWithin2Years', label: '2년 내 출산' },
          { key: 'wantsGraduatedRepayment', label: '체증식 상환 선호' },
        ].map((item) => (
          <label key={item.key} className="flex items-center gap-2 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 cursor-pointer hover:bg-[var(--accent)] hover:border-[var(--primary)] transition-all">
            <input
              type="checkbox"
              checked={data[item.key as keyof UserProfileInput] as boolean}
              onChange={(e) => update(item.key as keyof UserProfileInput, e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-xs font-black text-[var(--secondary)]">{item.label}</span>
          </label>
        ))}
      </div>

      {/* 6. Refinance */}
      <div className="pt-6 border-t border-gray-100">
         <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={data.hasExistingFirstHomeLoan}
              onChange={(e) => update('hasExistingFirstHomeLoan', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-black text-gray-700">기존 정책 대출 보유 (갈아타기 희망 시)</span>
          </label>
        <AnimatePresence>
          {data.hasExistingFirstHomeLoan && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                inputMode="numeric"
                value={data.existingFirstHomeLoanBalance}
                onChange={(e) => update('existingFirstHomeLoanBalance', e.target.value)}
                className="premium-input"
                placeholder="기존 대출 잔액을 만원 단위로 입력하세요"
              />
              <p className="mt-2 text-[10px] text-gray-400">
                갈아타기 시에는 기존 대출 잔액을 제외한 범위에서만 추가 대출 가능액을 추정합니다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
