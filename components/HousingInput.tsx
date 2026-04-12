'use client';

import { PropertyInput } from '@/types';
import { parseNumber, formatCurrencyKorean } from '@/lib/format';
import { 
  Building2, 
  Landmark, 
  Maximize, 
  MapPin, 
  Zap,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

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
      {/* 1. Price Context - Stabilized Cards */}
      <div className="space-y-6 p-8 md:p-10 rounded-[3rem] bg-white shadow-[var(--apple-shadow)] border border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-6 opacity-5">
            <Landmark className="w-24 h-24 text-[var(--secondary)]" />
         </div>
         
         <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] shadow-lg">
                <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black tracking-tighter text-[var(--secondary)] whitespace-nowrap">부동산 시세 정보</h3>
         </div>
         
         <div className="space-y-8 relative z-10">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block whitespace-nowrap">Actual Home Price</label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.homePrice}
                        onChange={(e) => update('homePrice', e.target.value)}
                        className="premium-input bg-gray-50/50 text-3xl py-8 pr-20"
                        placeholder="0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-gray-200">만원</div>
                </div>
                {renderMoney(data.homePrice) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[var(--primary)] font-black text-right mt-1">
                        {renderMoney(data.homePrice)}
                    </motion.p>
                )}
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block whitespace-nowrap">KB Market Price</label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.kbPrice}
                        onChange={(e) => update('kbPrice', e.target.value)}
                        className="premium-input bg-gray-50/50 text-3xl py-8 pr-20"
                        placeholder="0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-gray-200">만원</div>
                </div>
                {renderMoney(data.kbPrice) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[var(--primary)] font-black text-right mt-1">
                        {renderMoney(data.kbPrice)}
                    </motion.p>
                )}
            </div>
         </div>
      </div>

      {/* 2. Physical Specs - Dimension Input */}
      <div className="p-10 rounded-[3rem] bg-white shadow-[var(--apple-shadow)] border border-gray-100">
        <label className="input-label flex items-center gap-3 mb-6 whitespace-nowrap">
            <Maximize className="w-4 h-4 text-[var(--primary)]" /> 전용면적 상세 정보
        </label>
        <div className="relative">
            <input
                type="text"
                inputMode="numeric"
                value={data.exclusiveArea}
                onChange={(e) => update('exclusiveArea', e.target.value)}
                className="premium-input text-5xl font-black py-12 px-6 h-auto text-center"
                placeholder="84"
            />
            {/* Fix: Moved UNIT text further to avoid overlap */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-lg font-black text-gray-100 tracking-tighter opacity-30 select-none pointer-events-none">㎡ UNIT</div>
        </div>
        {renderArea(data.exclusiveArea) && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-4 text-xl text-[var(--primary)] font-black text-center tracking-tighter"
          >
            {renderArea(data.exclusiveArea)}
          </motion.p>
        )}
      </div>

      {/* 3. Regions & Regulation (Stabilized Pro Tiles) */}
      <div className="space-y-4">
        <label className="text-lg font-black tracking-tighter text-center block mb-4 whitespace-nowrap">지역 기반 규제 설정</label>
        <div className="grid grid-cols-1 gap-4">
          {[
            { key: 'isCapitalArea', label: '수도권 여부', icon: MapPin, desc: '서울, 경기, 인천 소재 주택' },
            { key: 'isRegulatedArea', label: '규제지역 여부', icon: ShieldCheck, desc: '투기과열지구 또는 조정대상지역' },
          ].map((item) => (
            <button
               key={item.key}
               onClick={() => update(item.key as keyof PropertyInput, !data[item.key as keyof PropertyInput])}
               className={`pro-tile p-6 flex-row items-center text-left gap-6 h-auto ${
                 data[item.key as keyof PropertyInput]
                   ? 'pro-tile-active scale-[1.01]'
                   : 'pro-tile-inactive'
               }`}
            >
                <div className={`p-4 rounded-2xl shrink-0 ${data[item.key as keyof PropertyInput] ? 'bg-white/10' : 'bg-gray-50'}`}>
                    <item.icon className={`w-8 h-8 ${data[item.key as keyof PropertyInput] ? 'text-[var(--primary)]' : 'text-gray-200'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xl font-black tracking-tighter flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.label}
                        {data[item.key as keyof PropertyInput] && <div className="w-2 h-2 bg-[var(--primary)] rounded-full shrink-0" />}
                    </span>
                    <p className={`text-[10px] font-bold opacity-60 truncate ${data[item.key as keyof PropertyInput] ? 'text-white' : 'text-gray-400'}`}>{item.desc}</p>
                </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
