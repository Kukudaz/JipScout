import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PremiumCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={cn('glass-card p-8', className)}
  >
    {children}
  </motion.div>
);

export const StatusBadge = ({ 
  status 
}: { 
  status: 'possible' | 'conditional' | 'difficult' 
}) => {
  const styles = {
    possible: 'bg-green-100 text-green-700 border-green-200',
    conditional: 'bg-amber-100 text-amber-700 border-amber-200',
    difficult: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  
  const labels = {
    possible: '승인 가능',
    conditional: '조건부 가능',
    difficult: '한도 미달/불가',
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-bold border', styles[status])}>
      {labels[status]}
    </span>
  );
};

export const SectionTitle = ({ title, subtitle, centered = false }: { title: string; subtitle?: string; centered?: boolean }) => (
  <div className={cn('mb-12', centered && 'text-center')}>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-bold mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn("text-xl text-[var(--text-sub)] max-w-2xl", centered && "mx-auto")}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export const Reveal = ({ 
  children, 
  delay = 0,
  centered = false 
}: { 
  children: React.ReactNode; 
  delay?: number;
  centered?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={cn(centered && "flex flex-col items-center")}
  >
    {children}
  </motion.div>
);
