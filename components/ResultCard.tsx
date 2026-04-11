'use client';

import { FinalLoanSummary, LoanProductResult, EligibilityStatus } from '@/types';
import { formatCurrency } from '@/lib/format';
import { LOAN_PRODUCT_GUIDES } from '@/lib/policies/loanRules';

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

function getStatusColor(status: EligibilityStatus): string {
  switch (status) {
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

function getStatusText(status: EligibilityStatus): string {
  switch (status) {
    case 'possible':
      return '가능';
    case 'conditional':
      return '조건부';
    case 'difficult':
      return '어려움';
    default:
      return '-';
  }
}

function ProductCard({ product }: { product: LoanProductResult }) {
  const guide = GUIDE_BY_PRODUCT_NAME[product.productName];

  const coreReasonItems = (() => {
    if (product.status === 'difficult') {
      return product.failReasons.slice(0, 3).map((reason) => ({ type: 'fail' as const, text: reason }));
    }

    if (product.status === 'conditional') {
      const failItems = product.failReasons.map((reason) => ({ type: 'fail' as const, text: reason }));
      const passItems = product.reasons.map((reason) => ({ type: 'pass' as const, text: reason }));
      return [...failItems, ...passItems].slice(0, 3);
    }

    return product.reasons.slice(0, 3).map((reason) => ({ type: 'pass' as const, text: reason }));
  })();

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">{product.productName}</p>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(product.status)}`}>
          {getStatusText(product.status)}
        </span>
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-2">
        {product.amount > 0 ? formatCurrency(product.amount) : '-'}
      </p>

      {coreReasonItems.length > 0 && (
        <div className="mb-2">
          {coreReasonItems.map((item, i) => (
            <p key={i} className={`text-xs ${item.type === 'fail' ? 'text-red-500' : 'text-green-600'}`}>
              {item.type === 'fail' ? '✗' : '✓'} {item.text}
            </p>
          ))}
        </div>
      )}

      {product.notes.length > 0 && (
        <div>
          {product.notes.slice(0, 3).map((note, i) => (
            <p key={i} className="text-xs text-gray-500">
              • {note}
            </p>
          ))}
        </div>
      )}

      {guide && (
        <div className="mt-3 p-3 rounded bg-gray-50 border border-gray-100 space-y-1">
          <p className="text-xs font-medium text-gray-700">현재 계산 기준 안내</p>
          <p className="text-xs text-gray-600">• {guide.ltv}</p>
          <p className="text-xs text-gray-600">• {guide.rate}</p>
          <p className="text-xs text-gray-600">• {guide.maxLimit}</p>
          {guide.keyConditions.slice(0, 2).map((condition, index) => (
            <p key={index} className="text-xs text-gray-600">
              • 핵심 조건: {condition}
            </p>
          ))}
        </div>
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
        <p className="text-3xl font-bold">{formatCurrency(result.finalEstimatedLoanAmount)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ProductCard product={result.newbornSpecial} />
        <ProductCard product={result.didimdol} />
        <ProductCard product={result.bogeumjari} />
        <ProductCard product={result.bankMortgage} />
      </div>

      <div className="border-t pt-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">체증식 가능 여부</h3>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.repayment.status)}`}>
            {getStatusText(result.repayment.status)}
          </span>
          {result.repayment.reasons.slice(0, 2).map((reason, i) => (
            <span key={i} className="text-sm text-gray-600">
              {reason}
            </span>
          ))}
        </div>
        {result.repayment.notes.length > 0 && (
          <div className="mt-2">
            {result.repayment.notes.slice(0, 2).map((note, i) => (
              <p key={i} className="text-xs text-gray-500">
                • {note}
              </p>
            ))}
          </div>
        )}

        {result.repaymentComparison && (
          <div className="mt-3 p-3 rounded bg-yellow-50 border border-yellow-100">
            <p className="text-xs font-medium text-yellow-800 mb-1">체증식 월 상환 비교(참고)</p>
            <p className="text-xs text-gray-700">• 원리금균등 월 상환액: {formatCurrency(result.repaymentComparison.equalMonthlyPayment)}</p>
            <p className="text-xs text-gray-700">• 체증식 초기 월 상환액: {formatCurrency(result.repaymentComparison.graduatedInitialMonthlyPayment)}</p>
            <p className="text-xs text-gray-700">• {result.repaymentComparison.projectionYears}년 후 예상 월 상환액: {formatCurrency(result.repaymentComparison.graduatedEstimatedLaterPayment)}</p>
            <p className="text-xs text-gray-700">• 초반 부담 감소액: {formatCurrency(result.repaymentComparison.savingsAtStart)}</p>
            <p className="text-xs text-gray-500 mt-1">{result.repaymentComparison.assumptionNote}</p>
            <p className="text-xs text-gray-500">체증식을 적용하면 초반 월 부담이 줄 수 있지만, 시간이 지날수록 상환액은 증가할 수 있습니다.</p>
          </div>
        )}
      </div>

      <div className="border-t pt-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">총 구매 가능 금액</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">보유 현금</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(result.userCash)}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">보유 현금 + 대출</p>
            <p className="text-xl font-bold text-blue-900">{formatCurrency(result.totalBuyingPower)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
        <p>• 본 결과는 입력값 기준 예상치입니다.</p>
        <p>• 실제 대출 가능 여부와 금리는 금융기관 심사 및 최신 규제에 따라 달라질 수 있습니다.</p>
        <p>• 정책대출 자격은 실제 신청 시점의 기준으로 다시 확인이 필요합니다.</p>
        <p>• 자영업자/프리랜서는 소득 입증 방식에 따라 실제 가능 금액이 달라질 수 있습니다.</p>
        <p className="mt-3 font-medium text-blue-800 bg-blue-50 p-3 rounded">
          💡 참고: 생애최초 우대 LTV를 적용받더라도 방공제(소액임차보증금 차감, 지역별 약 2,500만~5,500만원)가 발생해 실제 대출 가능액은 표시된 예상 한도보다 적을 수 있습니다.
        </p>
      </div>
    </section>
  );
}