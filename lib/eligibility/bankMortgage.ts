import { UserProfile, Property, LoanProductResult } from '@/types';
import { BANK_MORTGAGE_RULES } from '@/lib/policies/loanRules';

export function assessBankMortgage(
  user: UserProfile,
  property: Property
): LoanProductResult {
  const result: LoanProductResult = {
    productName: '일반 주담대',
    status: 'difficult',
    amount: 0,
    reasons: [],
    failReasons: [],
    notes: [],
  };

  const totalIncome = user.myIncome + user.spouseIncome;
  const monthlyIncome = totalIncome / 12;
  const maxMonthlyPayment =
    monthlyIncome * BANK_MORTGAGE_RULES.monthlyRepaymentRatio - user.existingDebtPayment;

  const monthlyRate = BANK_MORTGAGE_RULES.annualInterestRate / 12;
  const numPayments = BANK_MORTGAGE_RULES.loanTermYears * 12;

  let maxLoanByIncome = 0;
  if (maxMonthlyPayment > 0) {
    maxLoanByIncome =
      maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
  }

  const ltvRatio = property.isRegulatedArea
    ? BANK_MORTGAGE_RULES.regulatedAreaLtv
    : BANK_MORTGAGE_RULES.nonRegulatedAreaLtv;

  const maxLoanByLtv = property.homePrice * ltvRatio;
  const maxLoanByCashGap = Math.max(0, property.homePrice - user.cash);

  const eligibleAmount = Math.min(maxLoanByIncome, maxLoanByLtv, maxLoanByCashGap);

  if (eligibleAmount <= 0) {
    if (maxMonthlyPayment <= 0) {
      result.failReasons.push('소득 대비 기존 부채 부담이 커 추가 대출 여력이 없습니다');
    } else {
      result.failReasons.push('LTV 한도 또는 상환능력 기준 미달입니다');
    }

    if (user.jobType === 'selfEmployed' || user.jobType === 'freelancer') {
      result.notes.push('자영업자/프리랜서는 소득 입증 방식에 따라 실제 가능 금액이 달라질 수 있습니다');
    }

    return result;
  }

  result.status = 'conditional';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push(`LTV ${Math.floor(ltvRatio * 100)}% 기준 적용`);
  result.reasons.push(`월 상환 여력 기준 보수적으로 계산`);
  result.notes.push(`현재 계산 기준(가정 금리): 연 ${(BANK_MORTGAGE_RULES.annualInterestRate * 100).toFixed(1)}%`);

  if (property.isRegulatedArea) {
    result.notes.push('규제지역은 실제 심사 시 더 보수적으로 적용될 수 있습니다');
  }

  if (user.jobType === 'selfEmployed' || user.jobType === 'freelancer') {
    result.notes.push('자영업자/프리랜서는 실제 소득증빙에 따라 조정될 수 있습니다');
  }

  return result;
}
