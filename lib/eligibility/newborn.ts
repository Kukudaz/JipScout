import { UserProfile, Property, LoanProductResult } from '@/types';
import { LOAN_LIMITS, isDualIncome } from '@/lib/policies/loanRules';

export function assessNewbornSpecial(
  user: UserProfile,
  property: Property
): LoanProductResult {
  const result: LoanProductResult = {
    productName: '신생아 특례 디딤돌',
    status: 'difficult',
    amount: 0,
    reasons: [],
    failReasons: [],
    notes: [],
  };

  // Check newborn condition (core requirement)
  if (!user.newbornWithin2Years) {
    result.failReasons.push('대출신청일 기준 2년 내 출산 요건이 필요합니다');
  }

  // Check homeless
  if (!user.isHomeless) {
    result.failReasons.push('무주택 세대주 요건이 필요합니다');
  }

  // Check price limit
  if (property.homePrice > LOAN_LIMITS.newbornSpecial.maxPrice) {
    result.failReasons.push(`주택 가격 ${LOAN_LIMITS.newbornSpecial.maxPrice.toLocaleString()}만원 초과`);
  }

  // Check exclusive area limit
  if (property.exclusiveArea > 85) {
    result.failReasons.push('전용면적 85㎡ 초과');
  }

  // Check income limit (with dual income branch)
  const totalIncome = user.myIncome + user.spouseIncome;
  const dualIncome = isDualIncome(user.myIncome, user.spouseIncome);
  const incomeLimit = dualIncome
    ? LOAN_LIMITS.newbornSpecial.maxIncomeDual
    : LOAN_LIMITS.newbornSpecial.maxIncome;

  if (totalIncome > incomeLimit) {
    result.failReasons.push(`소득 기준 초과 (${incomeLimit.toLocaleString()}만원 이하 필요)`);
  }

  const eligibilitySnapshot = [
    `2년 내 출산: ${user.newbornWithin2Years ? '충족' : '미충족'}`,
    `무주택: ${user.isHomeless ? '충족' : '미충족'}`,
    `소득: 합산 ${totalIncome.toLocaleString()}만원 / 기준 ${incomeLimit.toLocaleString()}만원 ${dualIncome ? '(맞벌이 완화 기준)' : ''}`,
    `주택: 가격 ${property.homePrice.toLocaleString()}만원, 면적 ${property.exclusiveArea.toLocaleString()}㎡`,
  ];

  // If any fail reasons exist, return early
  if (result.failReasons.length > 0) {
    result.notes.push('신생아 특례는 아래 핵심 요건을 함께 확인해야 합니다');
    result.notes.push(...eligibilitySnapshot.slice(0, 3));
    return result;
  }

  // Calculate LTV based on first-time buyer and region
  const ltv = user.isFirstTimeBuyer && !property.isCapitalArea && !property.isRegulatedArea
    ? LOAN_LIMITS.newbornSpecial.firstTimeLtvNonCapitalNonRegulated
    : user.isFirstTimeBuyer
      ? LOAN_LIMITS.newbornSpecial.firstTimeLtvCapitalOrRegulated
      : LOAN_LIMITS.newbornSpecial.defaultLtv;

  // Calculate eligible amount
  const maxByPrice = property.homePrice * ltv;
  const eligibleAmount = Math.min(maxByPrice, LOAN_LIMITS.newbornSpecial.maxLoan);

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push('출산가구 우대 혜택 적용 가능');
  result.reasons.push('무주택·주택가격·면적 기준 충족');

  if (dualIncome) {
    result.reasons.push('맞벌이 가구 소득 기준 확대 적용');
    result.notes.push(`맞벌이 소득 기준(${incomeLimit.toLocaleString()}만원)으로 판정했습니다`);
  } else {
    result.notes.push(`단일소득 기준(${incomeLimit.toLocaleString()}만원)으로 판정했습니다`);
  }

  if (property.isRegulatedArea || property.isCapitalArea) {
    result.notes.push('수도권/규제지역 내 생애최초는 LTV 70%까지 적용');
  }

  return result;
}
