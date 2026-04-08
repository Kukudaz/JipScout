import { UserProfile, Property, LoanProductResult } from '@/types';
import { LOAN_LIMITS, checkDidimdolEligibility } from '@/lib/policies/loanRules';

export function assessDidimdol(
  user: UserProfile,
  property: Property
): LoanProductResult {
  const result: LoanProductResult = {
    productName: '디딤돌',
    status: 'difficult',
    amount: 0,
    reasons: [],
    failReasons: [],
    notes: [],
  };

  // Check basic eligibility
  const isEligible = checkDidimdolEligibility(user.isHomeless, user.isFirstTimeBuyer);
  if (!isEligible) {
    result.failReasons.push('무주택 및 생애최초 주택구입 조건 미충족');
    return result;
  }

  // Check price limit
  if (property.homePrice > LOAN_LIMITS.didimdol.maxPrice) {
    result.failReasons.push(`주택 가격 ${(LOAN_LIMITS.didimdol.maxPrice / 10000).toFixed(1)}억원 초과`);
    return result;
  }

  // Check income limit
  const totalIncome = user.myIncome + user.spouseIncome;
  if (totalIncome > LOAN_LIMITS.didimdol.maxIncome) {
    result.failReasons.push(`소득 기준 초과 (세전연소득 ${(LOAN_LIMITS.didimdol.maxIncome / 10000).toFixed(1)}억원 이하 필요)`);
    return result;
  }

  // Calculate eligible amount
  const maxByPrice = property.homePrice * LOAN_LIMITS.didimdol.ltvRatio;
  const maxByLimit = LOAN_LIMITS.didimdol.maxLoan;
  const eligibleAmount = Math.min(maxByPrice, maxByLimit);

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push('정부 정책대출 대상자');
  
  if (user.marriageStatus !== 'single') {
    result.reasons.push('혼인 상태로 추가 우대 가능');
  }
  
  if (property.isRegulatedArea) {
    result.notes.push('수도권/규제지역 내 적용 시 별도 확인 필요');
  }

  return result;
}
