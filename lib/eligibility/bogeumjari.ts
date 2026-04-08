import { UserProfile, Property, LoanProductResult } from '@/types';
import { LOAN_LIMITS, checkBogeumjariEligibility } from '@/lib/policies/loanRules';

export function assessBogeumjari(
  user: UserProfile,
  property: Property
): LoanProductResult {
  const result: LoanProductResult = {
    productName: '보금자리론',
    status: 'difficult',
    amount: 0,
    reasons: [],
    failReasons: [],
    notes: [],
  };

  // Check basic eligibility
  const isEligible = checkBogeumjariEligibility(user.isHomeless, user.isFirstTimeBuyer);
  if (!isEligible) {
    result.failReasons.push('무주택 및 생애최초 주택구입 조건 미충족');
    return result;
  }

  // Check price limit
  if (property.homePrice > LOAN_LIMITS.bogeumjari.maxPrice) {
    result.failReasons.push(`주택 가격 ${(LOAN_LIMITS.bogeumjari.maxPrice / 10000).toFixed(1)}억원 초과`);
    result.notes.push('보금자리론 가격 기준을 초과하는 경우 일반 주담대 검토 필요');
    return result;
  }

  // Check income limit
  const totalIncome = user.myIncome + user.spouseIncome;
  if (totalIncome > LOAN_LIMITS.bogeumjari.maxIncome) {
    result.failReasons.push(`소득 기준 초과 (세전연소득 ${(LOAN_LIMITS.bogeumjari.maxIncome / 10000).toFixed(1)}억원 이하 필요)`);
    return result;
  }

  // Calculate eligible amount
  const maxByPrice = property.homePrice * LOAN_LIMITS.bogeumjari.ltvRatio;
  const maxByLimit = LOAN_LIMITS.bogeumjari.maxLoan;
  const eligibleAmount = Math.min(maxByPrice, maxByLimit);

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push('보금자리론 대상자');
  
  // Age-based repayment term notes
  if (user.age <= 30) {
    result.notes.push('만기 50년 상환 가능 (연령 기준)');
  } else if (user.age <= 40) {
    result.notes.push('만기 40-50년 상환 검토 가능');
  } else {
    result.notes.push(`만기 ${Math.max(30, 65 - user.age)}년 상환 검토 권장`);
  }

  if (user.marriageStatus === 'newlywed') {
    result.notes.push('신혼부부 우대금리 적용 가능');
  }

  return result;
}
