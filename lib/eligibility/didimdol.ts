import { UserProfile, Property, LoanProductResult } from '@/types';
import { LOAN_LIMITS, isMarriedLike } from '@/lib/policies/loanRules';

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

  // Basic requirement: homeless
  if (!user.isHomeless) {
    result.failReasons.push('무주택 세대 요건이 필요합니다');
  }

  const totalIncome = user.myIncome + user.spouseIncome;
  const marriedLike = isMarriedLike(user.marriageStatus);
  const multiChild = user.childrenCount >= 2;

  // Price limit with preferential conditions
  const maxPrice = marriedLike || multiChild
    ? LOAN_LIMITS.didimdol.marriedOrMultiChildMaxPrice
    : LOAN_LIMITS.didimdol.defaultMaxPrice;

  if (property.homePrice > maxPrice) {
    result.failReasons.push(`주택 가격 ${maxPrice.toLocaleString()}만원 초과`);
  }

  // Income limit with preferential conditions
  let incomeLimit = LOAN_LIMITS.didimdol.defaultMaxIncome;
  if (user.isFirstTimeBuyer) {
    incomeLimit = Math.max(incomeLimit, LOAN_LIMITS.didimdol.firstTimeMaxIncome);
  }
  if (multiChild) {
    incomeLimit = Math.max(incomeLimit, LOAN_LIMITS.didimdol.marriedOrMultiChildMaxIncome);
  }
  if (user.marriageStatus === 'newlywed') {
    incomeLimit = Math.max(incomeLimit, LOAN_LIMITS.didimdol.newlywedMaxIncome);
  }

  if (totalIncome > incomeLimit) {
    result.failReasons.push(`소득 기준 초과 (${incomeLimit.toLocaleString()}만원 이하 필요)`);
  }

  // If any fail reasons exist, return early
  if (result.failReasons.length > 0) {
    return result;
  }

  // Max loan with preferential conditions
  let maxLoan = LOAN_LIMITS.didimdol.defaultMaxLoan;
  if (user.isFirstTimeBuyer) {
    maxLoan = Math.max(maxLoan, LOAN_LIMITS.didimdol.firstTimeMaxLoan);
  }
  if (marriedLike || multiChild) {
    maxLoan = Math.max(maxLoan, LOAN_LIMITS.didimdol.marriedOrMultiChildMaxLoan);
  }

  // LTV with preferential conditions
  const ltv = user.isFirstTimeBuyer && !property.isCapitalArea && !property.isRegulatedArea
    ? LOAN_LIMITS.didimdol.firstTimeLtvNonCapitalNonRegulated
    : user.isFirstTimeBuyer
      ? LOAN_LIMITS.didimdol.firstTimeLtvCapitalOrRegulated
      : LOAN_LIMITS.didimdol.defaultLtv;

  // Calculate eligible amount
  const maxByPrice = property.homePrice * ltv;
  const eligibleAmount = Math.min(maxByPrice, maxLoan);

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push('정부 정책대출 대상자');

  if (user.isFirstTimeBuyer) {
    result.reasons.push('생애최초 우대 적용');
  }
  if (marriedLike || multiChild) {
    result.reasons.push('신혼/2자녀 이상 우대 적용');
  }

  if (property.isRegulatedArea || property.isCapitalArea) {
    result.notes.push('수도권/규제지역 내 생애최초는 LTV 70%까지 적용');
  }

  return result;
}
