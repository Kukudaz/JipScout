import { UserProfile, Property, LoanProductResult } from '@/types';
import { LOAN_LIMITS } from '@/lib/policies/loanRules';

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

  // Check price limit
  if (property.homePrice > LOAN_LIMITS.bogeumjari.maxPrice) {
    result.failReasons.push(`주택 가격 ${LOAN_LIMITS.bogeumjari.maxPrice.toLocaleString()}만원 초과`);
    result.notes.push('보금자리론 가격 기준을 초과하는 경우 일반 주담대 검토 필요');
  }

  // Check income limit with newlywed preferential
  const totalIncome = user.myIncome + user.spouseIncome;
  const incomeLimit = user.marriageStatus === 'newlywed'
    ? LOAN_LIMITS.bogeumjari.newlywedMaxIncome
    : LOAN_LIMITS.bogeumjari.defaultMaxIncome;

  if (totalIncome > incomeLimit) {
    result.failReasons.push(`소득 기준 초과 (${incomeLimit.toLocaleString()}만원 이하 필요)`);
  }

  // If any fail reasons exist, return early
  if (result.failReasons.length > 0) {
    return result;
  }

  // Calculate LTV with regulated area deduction for non-first-time buyers
  let ltv = LOAN_LIMITS.bogeumjari.defaultLtv;
  if (property.isRegulatedArea && !user.isFirstTimeBuyer) {
    ltv = ltv - LOAN_LIMITS.bogeumjari.regulatedAreaLtvDeduction;
  }

  // Max loan with first-time buyer preferential
  const maxLoan = user.isFirstTimeBuyer
    ? LOAN_LIMITS.bogeumjari.firstTimeMaxLoan
    : LOAN_LIMITS.bogeumjari.defaultMaxLoan;

  // Calculate eligible amount
  const maxByPrice = property.homePrice * ltv;
  const eligibleAmount = Math.min(maxByPrice, maxLoan);

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push('보금자리론 대상자');

  if (user.isFirstTimeBuyer) {
    result.reasons.push('생애최초 우대 적용');
  }

  // Age-based repayment term notes
  if (user.age < 35 || (user.age < 40 && user.marriageStatus === 'newlywed')) {
    result.notes.push('만기 50년 검토 가능성이 있습니다');
  } else if (user.age < 40 || (user.age < 50 && user.marriageStatus === 'newlywed')) {
    result.notes.push('만기 40년 검토 가능성이 있습니다');
  } else {
    result.notes.push('기본 만기 10~30년 중심으로 보는 것이 안전합니다');
  }

  if (user.marriageStatus === 'newlywed') {
    result.notes.push('신혼부부 우대금리 적용 가능');
  }

  return result;
}
