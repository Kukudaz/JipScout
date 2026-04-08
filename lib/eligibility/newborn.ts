import { UserProfile, Property, LoanProductResult } from '@/types';
import { LOAN_LIMITS, checkNewbornSpecialEligibility } from '@/lib/policies/loanRules';

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

  // Check newborn eligibility
  const hasNewborn = checkNewbornSpecialEligibility(user.newbornWithin2Years, user.childrenCount);
  if (!hasNewborn) {
    result.failReasons.push('대출신청일 기준 2년 내 출산 이력 또는 자녀 보유 조건 미충족');
    return result;
  }

  // Check first-time buyer
  if (!user.isFirstTimeBuyer) {
    result.failReasons.push('생애최초 주택구입 조건 미충족');
    return result;
  }

  // Check homeless
  if (!user.isHomeless) {
    result.failReasons.push('무주택 세대주 조건 미충족');
    return result;
  }

  // Check price limit
  if (property.homePrice > LOAN_LIMITS.newbornSpecial.maxPrice) {
    result.failReasons.push(`주택 가격 ${(LOAN_LIMITS.newbornSpecial.maxPrice / 10000).toFixed(1)}억원 초과`);
    return result;
  }

  // Check income limit
  const totalIncome = user.myIncome + user.spouseIncome;
  const isNewlywed = user.marriageStatus !== 'single';
  const incomeLimit = isNewlywed 
    ? LOAN_LIMITS.newbornSpecial.maxIncomeNewlywed 
    : LOAN_LIMITS.newbornSpecial.maxIncome;
  
  if (totalIncome > incomeLimit) {
    result.failReasons.push(`소득 기준 초과 (세전연소득 ${(incomeLimit / 10000).toFixed(1)}억원 이하 필요)`);
    return result;
  }

  // Calculate eligible amount
  const maxByPrice = property.homePrice * LOAN_LIMITS.newbornSpecial.ltvRatio;
  const maxByLimit = LOAN_LIMITS.newbornSpecial.maxLoan;
  const eligibleAmount = Math.min(maxByPrice, maxByLimit);

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push('출산가구 우대 혜택 적용 가능');
  
  if (isNewlywed) {
    result.reasons.push('신혼/신규출산 가구 소득 기준 확대 적용');
  }
  
  if (property.isRegulatedArea) {
    result.notes.push('규제지역 내 신생아 특례 적용 시 LTV 80%까지 가능');
  }

  return result;
}
