import { UserProfile, Property, LoanProductResult } from '@/types';
import { getLtvRatio, DTI_RATIO, LOAN_INTEREST_RATE, LOAN_TERM_YEARS } from '@/lib/policies/loanRules';

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
  const totalDebtPayment = user.existingDebtPayment;

  // Calculate max loan based on income (DTI)
  const monthlyIncome = totalIncome / 12;
  const maxMonthlyPayment = monthlyIncome * DTI_RATIO - totalDebtPayment;
  
  const monthlyRate = LOAN_INTEREST_RATE / 12;
  const numPayments = LOAN_TERM_YEARS * 12;
  
  let maxLoanByIncome = 0;
  if (maxMonthlyPayment > 0) {
    maxLoanByIncome = maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate;
  }

  // Calculate max loan based on LTV
  const ltvRatio = getLtvRatio(user.isFirstTimeBuyer, property.isRegulatedArea);
  const maxLoanByLtv = property.homePrice * ltvRatio;

  // Calculate max loan based on cash gap
  const maxLoanByCashGap = Math.max(0, property.homePrice - user.cash);

  // Take the most conservative value
  const eligibleAmount = Math.min(maxLoanByIncome, maxLoanByLtv, maxLoanByCashGap);

  if (eligibleAmount <= 0) {
    if (maxMonthlyPayment <= 0) {
      result.failReasons.push('소득 대비 기존 부채 부담이 커 추가 대출 여력이 없음');
    } else {
      result.failReasons.push('LTV 한도 또는 상환 능력 기준 미달');
    }
    
    if (user.jobType === 'selfEmployed' || user.jobType === 'freelancer') {
      result.notes.push('자영업자/프리랜서는 소득 입증 방식에 따라 실제 가능 금액이 달라질 수 있습니다');
    }
    return result;
  }

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  
  result.reasons.push(`LTV ${Math.floor(ltvRatio * 100)}% 기준 적용`);
  result.reasons.push(`연소득 ${(totalIncome / 10000).toFixed(1)}억원 기준 상환 여력 산정`);

  if (user.isFirstTimeBuyer) {
    result.reasons.push('생애최초 우대 LTV 적용');
  }

  if (property.isRegulatedArea) {
    result.notes.push('규제지역 내 스트레스 DTI 적용 가능성 있음');
  }

  if (user.jobType === 'selfEmployed' || user.jobType === 'freelancer') {
    result.notes.push('자영업자/프리랜서는 실제 소득증빙 서류에 따라 금액이 조정될 수 있습니다');
  }

  return result;
}
