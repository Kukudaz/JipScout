'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, ArrowLeft, TrendingUp } from 'lucide-react';
import { useCalculationStore } from '@/hooks/useCalculationStore';
import { formatManwonToKoreanPreview } from '@/lib/format';
import AuthButton from '@/components/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const { loanAmount, dsr } = useCalculationStore();
  
  const isHome = pathname === '/';
  const isCalculator = pathname === '/calculator';

  // Different theme for Home (Cinema/Hero) vs others (Dashboard)
  const navBg = isHome ? 'bg-white/60 backdrop-blur-3xl' : 'bg-white/80 backdrop-blur-3xl';
  const borderCol = isHome ? 'border-gray-100/50' : 'border-gray-100/70';

  return (
    <nav className={`fixed top-0 w-full z-50 ${navBg} border-b ${borderCol} transition-colors duration-500`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {!isHome && (
            <>
              <Link href="/" className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="hidden sm:block w-px h-4 bg-gray-200" />
            </>
          )}
          <Link href="/" className="flex items-center gap-2 outline-none">
            <span className="text-2xl md:text-3xl font-black text-[var(--secondary)] tracking-[-0.08em]">
              Jip<span className="gradient-text">Scout</span>
            </span>
            <div className="px-2 py-0.5 bg-[var(--accent)] rounded-lg text-[8px] font-black text-[var(--primary)] uppercase tracking-widest">v3.0</div>
          </Link>
        </div>

        {/* Real-time Stats Section (Universal) */}
        <AnimatePresence>
          {loanAmount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex items-center justify-center gap-3 md:gap-8 overflow-hidden"
            >
              <div className="flex flex-col items-center">
                <span className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">내 분석 한도</span>
                <span className="text-xs md:text-sm font-black text-[var(--primary)] tracking-tight truncate">
                  {formatManwonToKoreanPreview(loanAmount)}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-100" />
              <div className="flex flex-col items-center">
                <span className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">예상 DSR</span>
                <span className={`text-xs md:text-sm font-black tracking-tight ${dsr < 40 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {dsr.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Section */}
        <div className="flex items-center gap-4 shrink-0">
          {!isCalculator && (
            <Link 
              href="/calculator" 
              className="hidden sm:flex items-center gap-2 bg-black text-white text-[9px] md:text-[10px] font-black px-5 md:px-8 py-2 md:py-3.5 rounded-full hover:bg-gray-800 transition-all uppercase tracking-widest"
            >
              <TrendingUp className="w-3 h-3" />
              Analyze
            </Link>
          )}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
