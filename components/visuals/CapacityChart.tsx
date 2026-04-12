import React from 'react';
import { motion } from 'framer-motion';

interface ChartProps {
  items: {
    label: string;
    amount: number;
    color?: string;
    maxLimit: number; // For scaling
  }[];
}

export const CapacityChart = ({ items }: ChartProps) => {
  // Find the absolute maximum to scale the bars correctly
  const maxPossible = Math.max(...items.map((i) => i.maxLimit), 1);

  return (
    <div className="space-y-6 w-full py-4">
      {items.map((item, idx) => (
        <div key={idx} className="group">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-[var(--secondary)]">{item.label}</span>
            <span className="text-lg font-black text-[var(--primary)]">
              {item.amount > 0 ? `${item.amount.toLocaleString()}만원` : '불가'}
            </span>
          </div>
          
          <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
            {/* Background Max Capacity Bar (Subtle) */}
            <div 
              className="absolute inset-0 bg-gray-200/50" 
              style={{ width: `${(item.maxLimit / maxPossible) * 100}%` }}
            />
            
            {/* Actual Eligible Bar */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(item.amount / maxPossible) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ backgroundColor: item.color || 'var(--primary)' }}
            />
          </div>
          
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">0</span>
            <span className="text-[10px] text-gray-400">기준 한도: {item.maxLimit.toLocaleString()}만</span>
          </div>
        </div>
      ))}
    </div>
  );
};
