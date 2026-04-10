import { UserProfile, Property, LoanProductResult } from '@/types';
import { LOAN_LIMITS, isDualIncome } from '@/lib/policies/loanRules';

export function assessNewbornSpecial(user: UserProfile, property: Property): LoanProductResult {
  const result: LoanProductResult = {
    productName: '신생아 특례 디딤돌',
    status: 'difficult',
    amount: 0,
    reasons: [],
    failReasons: [],
    notes: [],
  };

  if (!user.newbornWithin2Years) {
    result.failReasons.push('대출신청일 기준 2년 내 출산 요건이 필요합니다');
  }

  if (!user.isHomeless) {
    result.failReasons.push('무주택 세대주 요건이 필요합니다');
  }

  if (property.homePrice > LOAN_LIMITS.newbornSpecial.maxPrice) {
    result.failReasons.push(`주택 가격 ${LOAN_LIMITS.newbornSpecial.maxPrice.toLocaleString()}만원 초과`);
  }

  if (property.exclusiveArea > 85) {
    result.failReasons.push('전용면적 85㎡ 초과');
  }

  const totalIncome = user.myIncome + user.spouseIncome;
  const dualIncome = isDualIncome(user.myIncome, user.spouseIncome);
  const incomeLimit = dualIncome ? LOAN_LIMITS.newbornSpecial.maxIncomeDual : LOAN_LIMITS.newbornSpecial.maxIncome;
  const incomeRuleText = dualIncome ? '맞벌이(부부합산) 연 2억원 이하' : '단독소득 연 1.3억원 이하';

  if (totalIncome > incomeLimit) {
    result.failReasons.push(`소득 기준 초과 (${incomeLimit.toLocaleString()}만원 이하 필요)`);
  }

  const kbPriceForRule = property.kbPrice > 0 ? property.kbPrice : property.homePrice;
  const usingRefinanceException = user.hasUsedFirstTimeLoanBefore;

  if (usingRefinanceException && kbPriceForRule > LOAN_LIMITS.newbornSpecialRefinanceException.kbPriceLimit) {
    result.failReasons.push(
      `재대출 예외 기준 KB시세 ${LOAN_LIMITS.newbornSpecialRefinanceException.kbPriceLimit.toLocaleString()}만원 초과`
    );
  }

  const eligibilitySnapshot = [
    `2년 내 출산: ${user.newbornWithin2Years ? '충족' : '미충족'}`,
    `무주택: ${user.isHomeless ? '충족' : '미충족'}`,
    `소득: 합산 ${totalIncome.toLocaleString()}만원 / 기준 ${incomeLimit.toLocaleString()}만원 (${incomeRuleText})`,
    `주택: 매매가 ${property.homePrice.toLocaleString()}만원, KB시세 ${kbPriceForRule.toLocaleString()}만원, 면적 ${property.exclusiveArea.toLocaleString()}㎡`,
  ];

  if (result.failReasons.length > 0) {
    result.notes.push('신생아 특례는 아래 핵심 요건을 함께 확인해야 합니다');
    result.notes.push(...eligibilitySnapshot.slice(0, 3));
    result.notes.push('소득 기준 요약: 단독소득 연 1.3억원 이하 / 맞벌이(부부합산) 연 2억원 이하');

    if (usingRefinanceException) {
      result.notes.push('생애최초 사용 이력으로 신생아 특례 재대출 예외 규칙을 우선 적용했습니다');
      result.notes.push('재대출 예외 기준: KB시세 6억원 이하, 최대 5억원, LTV 70% 고정');
      result.notes.push('재대출 예외에서는 생애최초 우대 LTV 80%를 적용하지 않습니다');
    }

    return result;
  }

  let ltv = user.isFirstTimeBuyer && !property.isCapitalArea && !property.isRegulatedArea
    ? LOAN_LIMITS.newbornSpecial.firstTimeLtvNonCapitalNonRegulated
    : user.isFirstTimeBuyer
      ? LOAN_LIMITS.newbornSpecial.firstTimeLtvCapitalOrRegulated
      : LOAN_LIMITS.newbornSpecial.defaultLtv;
  let maxLoanCap = LOAN_LIMITS.newbornSpecial.maxLoan;

  if (usingRefinanceException) {
    ltv = LOAN_LIMITS.newbornSpecialRefinanceException.fixedLtv;
    maxLoanCap = LOAN_LIMITS.newbornSpecialRefinanceException.maxLoan;
    result.reasons.push('생애최초 사용 이력으로 인해 신생아 특례는 우대 LTV 없이 70% 기준 적용');
    result.notes.push('재대출 예외 기준: KB시세 6억원 이하, 최대 5억원');
  }

  const maxByPrice = property.homePrice * ltv;
  const eligibleAmount = Math.min(maxByPrice, maxLoanCap);

  result.status = 'possible';
  result.amount = Math.floor(eligibleAmount);
  result.reasons.push('출산가구 우대 혜택 적용 가능');
  result.reasons.push('무주택·주택가격·면적 기준 충족');
  result.reasons.push(`소득 기준 충족 (${incomeRuleText})`);

  if (dualIncome) {
    result.notes.push(`맞벌이(부부합산) 기준 ${incomeLimit.toLocaleString()}만원(연 2억원)으로 판정했습니다`);
  } else {
    result.notes.push(`단독소득 기준 ${incomeLimit.toLocaleString()}만원(연 1.3억원)으로 판정했습니다`);
  }

  if (!usingRefinanceException && (property.isRegulatedArea || property.isCapitalArea)) {
    result.notes.push('수도권/규제지역 내 생애최초는 LTV 70%까지 적용됩니다');
  }

  if (user.wantsNewbornRefinance) {
    if (!user.hasExistingFirstHomeLoan) {
      result.notes.push('갈아타기 희망으로 입력했지만 기존 생애최초 신혼부부 대출 정보가 없어 추가 확인이 필요합니다');
    } else {
      const refinanceLtvCap = Math.min(property.homePrice * ltv, maxLoanCap);
      const additionalAvailable = Math.max(0, refinanceLtvCap - user.existingFirstHomeLoanBalance);
      const ltvMaintainable = user.existingFirstHomeLoanBalance <= refinanceLtvCap;

      result.notes.push(`갈아타기 가능 여부: ${ltvMaintainable ? '가능(조건부)' : '어려움'}`);
      result.notes.push(`LTV 유지 가능 여부: ${ltvMaintainable ? '유지 가능' : '기존 잔액으로 LTV 초과 가능성'}`);
      result.notes.push(`기존 잔액 제외 후 추가 가능액(예상): ${Math.floor(additionalAvailable).toLocaleString()}만원`);
    }
  }

  return result;
}
