'use client';

import { FinalLoanSummary, LoanProductResult, EligibilityStatus } from '@/types';
import { formatCurrency } from '@/lib/format';

interface Props {
  result: FinalLoanSummary | null;
}

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
      
      {product.reasons.length > 0 && (
        <div className="mb-2">
          {product.reasons.map((reason, i) => (
            <p key={i} className="text-xs text-green-600">✓ {reason}</p>
          ))}
        </div>
      )}
      
      {product.failReasons.length > 0 && (
        <div className="mb-2">
          {product.failReasons.map((reason, i) => (
            <p key={i} className="text-xs text-red-500">✗ {reason}</p>
          ))}
        </div>
      )}
      
      {product.notes.length > 0 && (
        <div>
          {product.notes.map((note, i) => (
            <p key={i} className="text-xs text-gray-500">• {note}</p>
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
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.repayment.graduatedRepaymentPossible ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'}`}>
            {result.repayment.graduatedRepaymentPossible ? '가능' : '불가'}
          </span>
          {result.repayment.reasons.map((reason, i) => (
            <span key={i} className="text-sm text-gray-600">{reason}</span>
          ))}
        </div>
        {result.repayment.notes.length > 0 && (
          <div className="mt-2">
            {result.repayment.notes.map((note, i) => (
              <p key={i} className="text-xs text-gray-500">• {note}</p>
            ))}
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
      </div>
    </section>
  );
}
