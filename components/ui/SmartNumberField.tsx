import { useState, useEffect } from 'react';
import { formatManwonToKoreanPreview, formatManwonRaw } from '@/lib/format';
import { TooltipHelp } from './TooltipHelp';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  tooltip?: string;
  onChange: (value: number) => void;
}

export function SmartNumberField({ label, value, min, max, step, unit, tooltip, onChange }: Props) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    if (document.activeElement?.id !== `input-${label}`) {
      setInputValue(value.toString());
    }
  }, [value, label]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(rawValue);
    const num = Number(rawValue);
    if (!isNaN(num)) {
      onChange(Math.min(Math.max(num, 0), max)); // Don't strictly enforce min during typing, only max, and > 0
    }
  };

  const handleBlur = () => {
    let num = Number(inputValue);
    if (isNaN(num)) num = min;
    num = Math.max(min, Math.min(num, max));
    setInputValue(num.toString());
    onChange(num);
  };

  const getDynamicStep = (currentValue: number) => {
    if (max > 100000) {
      if (currentValue < 10000) return 100;
      if (currentValue < 100000) return 500;
      return 1000;
    }
    return step;
  };

  const currentStep = getDynamicStep(value);

  // Background track calculation
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5">
          <label htmlFor={`input-${label}`} className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {label}
          </label>
          {tooltip && <TooltipHelp text={tooltip} />}
        </div>
        
        <div className="text-right flex flex-col items-end">
          <span className="text-2xl font-black text-[var(--secondary)] tracking-tighter">
            {formatManwonToKoreanPreview(value)}
          </span>
          {value >= 10000 && (
            <span className="text-[10px] font-bold text-gray-400 tracking-tight">
              {formatManwonRaw(value)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50/50 p-2 sm:p-3 rounded-2xl border border-gray-100">
        <div className="flex-1 px-2 relative h-10 flex items-center min-w-[150px]">
          {/* Custom Slider Track */}
          <div className="absolute inset-x-2 h-2 bg-gray-200 rounded-full overflow-hidden pointer-events-none">
            <div 
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-75"
              style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={currentStep}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        
        <div className="relative flex items-center w-32 shrink-0">
          <input
            id={`input-${label}`}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full h-10 px-3 pr-8 text-right font-black text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <span className="absolute right-3 text-xs font-black text-gray-400 pointer-events-none">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
