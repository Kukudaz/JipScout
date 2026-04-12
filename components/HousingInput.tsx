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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="input-label">희망 매매가 (만원)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.homePrice}
            onChange={(e) => update('homePrice', e.target.value)}
            className="premium-input"
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
            className="premium-input"
            placeholder="예: 48000"
          />
          {renderMoney(data.kbPrice) && (
            <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderMoney(data.kbPrice)}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="input-label">전용면적 (㎡)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.exclusiveArea}
            onChange={(e) => update('exclusiveArea', e.target.value)}
            className="premium-input"
            placeholder="예: 84"
          />
          {renderArea(data.exclusiveArea) && (
            <p className="mt-1 text-xs text-[var(--primary)] font-bold">{renderArea(data.exclusiveArea)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'isCapitalArea', label: '수도권 여부' },
          { key: 'isRegulatedArea', label: '규제지역 여부' },
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 cursor-pointer hover:bg-[var(--accent)] hover:border-[var(--primary)] transition-all">
            <input
              type="checkbox"
              checked={data[item.key as keyof PropertyInput] as boolean}
              onChange={(e) => update(item.key as keyof PropertyInput, e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-xs font-bold text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
