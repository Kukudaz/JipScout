'use client';

import { CalculationResult, LoanAssessment } from '@/types';

interface Props {
  result: CalculationResult | null;
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()}만원`;
}

function getEligibilityColor(eligibility: string): string {
  switch (eligibility) {
    case 'possible':
      return 'text-green-600 bg-green-50';
    case 'conditional':
      return 'text-yellow-600 bg-yellow-50';
    case 'difficult':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

function getEligibilityText(eligibility: string): string {
  switch (eligibility) {
    case 'possible':
      return '가능성 있음';
    case 'conditional':
      return '조건부';
    case 'difficult':
      return '어려움';
    default:
      return '-';
  }
}

function LoanAssessmentCard({ title, assessment }: { title: string; assessment: LoanAssessment }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-700">{title}</p>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getEligibilityColor(assessment.eligibility)}`}>
          {getEligibilityText(assessment.eligibility)}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {assessment.amount > 0 ? formatCurrency(assessment.amount) : '-'}
      </p>
      {assessment.reason && (
        <p className="text-xs text-gray-500 mt-2">{assessment.reason}</p>
      )}
    </div>
  );
}

export default function ResultCard({ result }: Props) {
  if (!result) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900">대출 가능액 판정 결과</h2>

      <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
        <p className="text-sm text-blue-100 mb-1">예상 최종 대출 가능액</p>
        <p className="text-3xl font-bold">{formatCurrency(result.finalEstimatedLoan)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <LoanAssessmentCard title="디딤돌" assessment={result.didimdol} />
        <LoanAssessmentCard title="보금자리론" assessment={result.bogeumjari} />
        <LoanAssessmentCard title="일반 주담대" assessment={result.regularMortgage} />
      </div>

      <div className="border-t pt-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">체증식 가능 여부</h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.steppingEligible ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'}`}>
            {result.steppingEligible ? '가능' : '불가'}
          </span>
          {result.steppingReason && (
            <span className="text-sm text-gray-600">{result.steppingReason}</span>
          )}
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">총 구매 가능 금액</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">보유 현금</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(result.cash)}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">보유 현금 + 대출</p>
            <p className="text-xl font-bold text-blue-900">{formatCurrency(result.totalPurchasingPower)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
        <p>• 본 결과는 입력값 기준 예상치입니다.</p>
        <p>• 실제 대출 가능 여부와 금리는 금융기관 심사 및 최신 규제에 따라 달라질 수 있습니다.</p>
        <p>• 정책대출 자격은 실제 신청 시점의 기준으로 다시 확인이 필요합니다.</p>
      </div>
    </section>
  );
}
