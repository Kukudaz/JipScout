'use client';

import React from 'react';
import { formatCurrencyKorean } from '@/lib/format';

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  unit?: string;
  showKorean?: boolean;
}

export default function Slider({ value, min, max, step = 1, onChange, label, unit = '', showKorean = false }: Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(raw);
    if (!isNaN(num)) onChange(num);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end gap-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 shrink-0">{label}</label>
        <div className="flex items-baseline gap-1">
          <input
            type="text"
            inputMode="numeric"
            value={value.toLocaleString()}
            onChange={handleInputChange}
            className="text-2xl font-black tracking-tighter text-[var(--secondary)] bg-transparent outline-none text-right w-32 border-b-2 border-transparent focus:border-[var(--primary)] transition-colors"
          />
          <span className="text-[10px] font-black text-gray-400 shrink-0">{unit}</span>
        </div>
      </div>
      {showKorean && value > 0 && (
        <p className="text-[11px] text-[var(--primary)] font-bold text-right -mt-1">{formatCurrencyKorean(value)}</p>
      )}
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(value, max)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="premium-slider"
        />
        <div 
          className="absolute h-2 bg-[var(--primary)] rounded-full pointer-events-none" 
          style={{ width: `${Math.min(((value - min) / (max - min)) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
