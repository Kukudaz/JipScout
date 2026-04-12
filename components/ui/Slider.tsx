'use client';

import React from 'react';

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  unit?: string;
}

export default function Slider({ value, min, max, step = 1, onChange, label, unit = '' }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
        <div className="text-right">
          <span className="text-2xl font-black tracking-tighter text-[var(--secondary)]">{value.toLocaleString()}</span>
          <span className="text-[10px] font-black ml-1 text-gray-400">{unit}</span>
        </div>
      </div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="premium-slider"
        />
        <div 
          className="absolute h-2 bg-[var(--primary)] rounded-full pointer-events-none" 
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
    </div>
  );
}
