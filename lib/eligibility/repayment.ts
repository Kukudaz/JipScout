import { UserProfile, RepaymentResult } from '@/types';
import { GRADUATED_REPAYMENT } from '@/lib/policies/loanRules';

export function assessGraduatedRepayment(user: UserProfile): RepaymentResult {
  const result: RepaymentResult = {
    graduatedRepaymentPossible: false,
    reasons: [],
    notes: [],
  };

  if (!user.wantsGraduatedRepayment) {
    result.notes.push('체증식 상환 방식 미선택');
    return result;
  }

  // Check age requirement
  if (user.age < GRADUATED_REPAYMENT.minAge) {
    result.reasons.push(`나이 기준 미달 (최소 ${GRADUATED_REPAYMENT.minAge}세 필요)`);
    return result;
  }

  if (user.age > GRADUATED_REPAYMENT.maxAge) {
    result.reasons.push(`나이 기준 초과 (최대 ${GRADUATED_REPAYMENT.maxAge}세 이하)`);
    return result;
  }

  // Check job type requirement
  if (!(GRADUATED_REPAYMENT.allowedJobTypes as readonly string[]).includes(user.jobType)) {
    result.reasons.push('체증식은 직장인(정규직)에 한해 가능합니다');
    result.notes.push('자영업자/프리랜서는 체증식 적용 대상이 아님');
    return result;
  }

  result.graduatedRepaymentPossible = true;
  result.reasons.push('나이 및 직업 조건 충족');
  result.reasons.push('초기 낮은 상환액으로 시작하여 연차별 증액 가능');
  result.notes.push('정부대출 상품 중 체증식 적용 가능 상품 확인 필요');

  return result;
}
