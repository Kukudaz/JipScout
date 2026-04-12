'use client';

import { FinalLoanSummary, LoanProductResult, EligibilityStatus } from '@/types';
import { formatCurrency, formatCurrencyKorean } from '@/lib/format';
import { LOAN_PRODUCT_GUIDES } from '@/lib/policies/loanRules';
import { CapacityChart } from '@/components/visuals/CapacityChart';
import { StatusBadge, PremiumCard, Reveal } from '@/components/ui/Layout';
import { motion } from 'framer-motion';

interface Props {
  result: FinalLoanSummary | null;
}

const GUIDE_BY_PRODUCT_NAME: Record<
  string,
  (typeof LOAN_PRODUCT_GUIDES)[keyof typeof LOAN_PRODUCT_GUIDES]
> = {
  '신생아 특례 디딤돌': LOAN_PRODUCT_GUIDES.newbornSpecial,
  디딤돌: LOAN_PRODUCT_GUIDES.didimdol,
  보금자리론: LOAN_PRODUCT_GUIDES.bogeumjari,
  '일반 주담대': LOAN_PRODUCT_GUIDES.bankMortgage,
};

function getProductMaxLimit(name: string): number {
  if (name.includes('신생아')) return 50000;
  if (name === '디딤돌') return 32000;
  if (name === '보금자리론') return 42000;
  return 80000; // General bank cap for visualization
}

export default function ResultCard({ result }: Props) {
  if (!result) return null;

  const chartItems = [
    { 
      label: '신생아 특례', 
      amount: result.newbornSpecial.amount, 
      maxLimit: getProductMaxLimit('신생아 특례 디딤돌'),
      color: 'var(--primary)'
    },
    { 
      label: '디딤돌 대출', 
      amount: result.didimdol.amount, 
      maxLimit: getProductMaxLimit('디딤돌'),
      color: '#003153' // Prussian Blue
    },
    { 
      label: '보금자리론', 
      amount: result.bogeumjari.amount, 
      maxLimit: getProductMaxLimit('보금자리론'),
      color: '#4B5563'
    },
    { 
      label: '일반 주담대', 
      amount: result.bankMortgage.amount, 
      maxLimit: getProductMaxLimit('일반 주담대'),
      color: '#9CA3AF'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Target Focus Result */}
      <PremiumCard className="bg-[var(--secondary)] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10">
          <p className="text-turquoise text-sm font-bold tracking-widest uppercase mb-4 opacity-80" style={{ color: 'var(--primary)' }}>
            예상 최종 대출 가능액
          </p>
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <h3 className="text-5xl md:text-7xl font-black">
              {formatCurrencyKorean(result.finalEstimatedLoanAmount)}
            </h3>
            <p className="text-xl md:text-2xl opacity-60 mb-2">가능함</p>
          </div>
          
          <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs opacity-50 mb-2">보유 현금 합산 구매력</p>
              <p className="text-2xl font-bold text-turquoise" style={{ color: 'var(--primary)' }}>
                {formatCurrencyKorean(result.totalBuyingPower)}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-50 mb-2">체증식 상환 가능성</p>
              <p className="text-2xl font-bold">
                {result.repayment.status === 'possible' ? '적극 권장' : result.repayment.status === 'conditional' ? '조건부 확인' : '불가'}
              </p>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* Visual Analytics Section */}
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-2xl font-bold mb-6">상품별 한도 시각화</h3>
            <CapacityChart items={chartItems} />
            <p className="text-xs text-[var(--text-sub)] mt-6 leading-relaxed">
              * 바의 전체 길이는 각 상품의 정책상 최대 한도 비율을 나타냅니다. <br/>
              * 보라색 및 남색 영역이 귀하의 조건에서 산출된 실제 예상 한도입니다.
            </p>
          </div>

          <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">판정 요약</h3>
              {[result.newbornSpecial, result.didimdol, result.bogeumjari, result.bankMortgage].map((p, idx) => (
                <div key={idx} className="bg-white border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between hover:border-[var(--primary)] transition-colors group">
                    <div>
                        <p className="text-sm font-bold text-gray-500 group-hover:text-[var(--secondary)] transition-colors">{p.productName}</p>
                        <p className="text-lg font-black">{p.amount > 0 ? formatCurrency(p.amount) : '판정 불가'}</p>
                    </div>
                    <StatusBadge status={p.status} />
                </div>
              ))}
          </div>
        </div>
      </Reveal>

      {/* Warning/Tips */}
      <Reveal delay={0.2}>
        <div className="bg-[var(--accent)] rounded-3xl p-8 border border-[var(--primary)]/20">
            <h4 className="text-lg font-bold text-[var(--secondary)] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xs">!</span>
                꼭 확인해야 할 전문가의 팁
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--secondary)] opacity-80 leading-relaxed">
                <p>생애최초 LTV 80%가 적용되더라도 실제로 방공제(지역별 2,500~5,500만)가 발생해 현금이 더 필요할 수 있습니다.</p>
                <p>자영업자나 프리랜서는 소득 입증 형태(건보료 등)에 따라 은행 심사가 크게 달라질 수 있습니다.</p>
            </div>
        </div>
      </Reveal>
    </div>
  );
}