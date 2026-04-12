'use client';

import { PropertyInput } from '@/types';
import { parseNumber, formatCurrencyKorean } from '@/lib/format';

interface Props {
  data: PropertyInput;
  onChange: (data: PropertyInput) => void;
}

export default function HousingInput({ data, onChange }: Props) {
  const update = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) => {
    onChange({ ...data, [key]: value });
  };

  const renderMoney = (val: string) => {
    const num = parseNumber(val);
    return num > 0 ? formatCurrencyKorean(num) : '';
  };

  const renderArea = (val: string) => {
    const num = parseNumber(val);
    if (num <= 0) return '';
    const pyeong = (num / 3.3).toFixed(1);
    return `${num}㎡ (약 ${pyeong}평)`;
  };

  return (
    <div className="space-y-12">
      {/* 1. Price Context */}
      <div className="space-y-8 p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">시세 정보</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="input-label">희망 매매가 (만원)</label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={data.homePrice}
                    onChange={(e) => update('homePrice', e.target.value)}
                    className="premium-input bg-white"
                    placeholder="예: 50000"
                />
                {renderMoney(data.homePrice) && (
                    <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.homePrice)}</p>
                )}
            </div>

            <div>
                <label className="input-label">KB시세 (만원)</label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={data.kbPrice}
                    onChange={(e) => update('kbPrice', e.target.value)}
                    className="premium-input bg-white"
                    placeholder="예: 48000"
                />
                {renderMoney(data.kbPrice) && (
                    <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.kbPrice)}</p>
                )}
                <p className="mt-2 text-[10px] text-gray-400 leading-tight">KB시세는 대출 한도 판정의 기준이 됩니다. 정확한 시세 확인이 필요합니다.</p>
            </div>
         </div>
      </div>

      {/* 2. Physical Specs */}
      <div className="space-y-6">
        <label className="input-label">전용면적 (㎡)</label>
        <div className="relative">
            <input
                type="text"
                inputMode="numeric"
                value={data.exclusiveArea}
                onChange={(e) => update('exclusiveArea', e.target.value)}
                className="premium-input text-2xl font-black py-6 px-8 h-auto"
                placeholder="예: 84"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-gray-300">㎡ UNIT</div>
        </div>
        {renderArea(data.exclusiveArea) && (
          <p className="mt-2 text-sm text-[var(--primary)] font-black text-center">{renderArea(data.exclusiveArea)}</p>
        )}
      </div>

      {/* 3. Regions & Regulation (Apple Style Tiles) */}
      <div className="space-y-6 pt-8 border-t border-gray-100">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">지역 및 규제 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'isCapitalArea', label: '수도권 여부', desc: '서울, 경기, 인천 소재 주택입니다.' },
            { key: 'isRegulatedArea', label: '규제지역 여부', desc: '투기과열지구 또는 조정대상지역입니다.' },
          ].map((item) => (
            <button
               key={item.key}
               onClick={() => update(item.key as keyof PropertyInput, !data[item.key as keyof PropertyInput])}
               className={`p-6 rounded-3xl text-left transition-all border-2 flex flex-col gap-2 ${
                 data[item.key as keyof PropertyInput]
                   ? 'bg-[var(--accent)] border-[var(--primary)]'
                   : 'bg-white border-gray-100 hover:border-gray-200'
               }`}
            >
                <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-black text-[var(--secondary)]">{item.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${data[item.key as keyof PropertyInput] ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-gray-200'}`}>
                        {data[item.key as keyof PropertyInput] && '✓'}
                    </div>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
