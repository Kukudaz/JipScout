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
    <div className="space-y-16">
      {/* 1. Price Context - Ultra Premium Cards */}
      <div className="space-y-10 p-12 rounded-[4rem] bg-white shadow-[var(--apple-shadow)] border border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Landmark className="w-32 h-32 text-[var(--secondary)]" />
         </div>
         
         <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] shadow-lg">
                <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-[var(--secondary)]">부동산 시세 정보</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-4">
                <label className="input-label text-gray-400 uppercase tracking-widest text-[10px]">Actual Home Price</label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.homePrice}
                        onChange={(e) => update('homePrice', e.target.value)}
                        className="premium-input bg-gray-50/50 text-4xl py-10"
                        placeholder="0"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xl font-black text-gray-200">만원</div>
                </div>
                {renderMoney(data.homePrice) && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-lg text-[var(--primary)] font-black text-right mt-2">
                        {renderMoney(data.homePrice)}
                    </motion.p>
                )}
            </div>

            <div className="space-y-4">
                <label className="input-label text-gray-400 uppercase tracking-widest text-[10px]">KB Market Price</label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={data.kbPrice}
                        onChange={(e) => update('kbPrice', e.target.value)}
                        className="premium-input bg-gray-50/50 text-4xl py-10"
                        placeholder="0"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xl font-black text-gray-200">만원</div>
                </div>
                {renderMoney(data.kbPrice) && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-lg text-[var(--primary)] font-black text-right mt-2">
                        {renderMoney(data.kbPrice)}
                    </motion.p>
                )}
                <div className="bg-[var(--secondary)]/5 p-4 rounded-2xl flex gap-3 mt-4 items-center">
                    <Zap className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    <p className="text-[10px] text-[var(--secondary)] font-black leading-tight opacity-70">KB시세는 대출 한도 실무 판정의 직결되는 핵심 기준입니다.</p>
                </div>
            </div>
         </div>
      </div>

      {/* 2. Physical Specs - Massive Dimension Input */}
      <div className="p-12 rounded-[4rem] bg-white shadow-[var(--apple-shadow)] border border-gray-100">
        <label className="input-label flex items-center gap-3 mb-8">
            <Maximize className="w-5 h-5 text-[var(--primary)]" /> 전용면적 상세 정보
        </label>
        <div className="relative">
            <input
                type="text"
                inputMode="numeric"
                value={data.exclusiveArea}
                onChange={(e) => update('exclusiveArea', e.target.value)}
                className="premium-input text-6xl font-black py-16 px-12 h-auto text-center"
                placeholder="00"
            />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-100 tracking-widest">㎡ UNIT</div>
        </div>
        {renderArea(data.exclusiveArea) && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mt-8 text-2xl text-[var(--primary)] font-black text-center tracking-tighter"
          >
            {renderArea(data.exclusiveArea)}
          </motion.p>
        )}
      </div>

      {/* 3. Regions & Regulation (Apple Pro Tiles) */}
      <div className="space-y-10">
        <label className="text-2xl font-black tracking-tighter text-center block mb-10">지역 기반 규제 설정</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { key: 'isCapitalArea', label: '수도권 여부', icon: MapPin, desc: '서울, 경기, 인천 소재의 주택인 경우 체크하십시오.' },
            { key: 'isRegulatedArea', label: '규제지역 여부', icon: ShieldCheck, desc: '투기과열지구 또는 조정대상지역 등 금융 규제가 적용됩니다.' },
          ].map((item) => (
            <button
               key={item.key}
               onClick={() => update(item.key as keyof PropertyInput, !data[item.key as keyof PropertyInput])}
               className={`pro-tile p-12 items-start text-left gap-8 ${
                 data[item.key as keyof PropertyInput]
                   ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-2xl scale-[1.03]'
                   : 'bg-white border-gray-100 hover:border-gray-200 group'
               }`}
            >
                <div className={`p-6 rounded-[2rem] transition-colors ${data[item.key as keyof PropertyInput] ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-[var(--accent)]'}`}>
                    <item.icon className={`w-10 h-10 ${data[item.key as keyof PropertyInput] ? 'text-[var(--primary)]' : 'text-gray-200 group-hover:text-[var(--primary)]'}`} />
                </div>
                <div className="space-y-3">
                    <span className="text-3xl font-black tracking-tighter block">{item.label}</span>
                    <p className={`text-sm font-bold opacity-40 leading-relaxed ${data[item.key as keyof PropertyInput] ? 'text-white' : 'text-gray-400'}`}>{item.desc}</p>
                </div>
                <div className={`absolute top-10 right-10 w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${data[item.key as keyof PropertyInput] ? 'bg-white text-[var(--secondary)] border-white scale-125' : 'border-gray-100 text-gray-100'}`}>
                    {data[item.key as keyof PropertyInput] && <div className="w-2 h-2 bg-[var(--primary)] rounded-full" />}
                </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
