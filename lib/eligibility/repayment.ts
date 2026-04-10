import { UserProfile, RepaymentResult } from '@/types';
import { GRADUATED_REPAYMENT, isMarriedLike } from '@/lib/policies/loanRules';

export function assessGraduatedRepayment(user: UserProfile): RepaymentResult {
  const result: RepaymentResult = {
    status: 'difficult',
    reasons: [],
    notes: [],
  };

  if (!user.wantsGraduatedRepayment) {
    result.notes.push('체증식 상환 방식 미선택');
    return result;
  }

  if (user.age >= GRADUATED_REPAYMENT.maxAgeExclusive) {
    result.status = 'difficult';
    result.reasons.push('만 40세 미만 조건에 해당하지 않습니다');
    return result;
  }

  if (!(GRADUATED_REPAYMENT.allowedJobTypes as readonly string[]).includes(user.jobType)) {
    const spouseEmployee =
      isMarriedLike(user.marriageStatus) &&
      (GRADUATED_REPAYMENT.allowedJobTypes as readonly string[]).includes(user.spouseJobType);

    if (spouseEmployee) {
      result.status = 'conditional';
      result.reasons.push('본인 기준 체증식은 제한될 수 있으나 배우자 근로소득 기준으로 검토 가능합니다');
      result.notes.push('실제 진행 시 배우자 명의/주채무자 여부 확인이 필요합니다');
      return result;
    }

    result.status = 'difficult';
    if (user.jobType === 'selfEmployed') {
      result.reasons.push('자영업자는 체증식 적용이 어렵습니다');
    } else {
      result.reasons.push('직장인(근로소득) 기준이 아니면 체증식 적용이 제한될 수 있습니다');
    }
    result.notes.push('체증식은 미래 소득 증가를 전제로 해 직장인 중심으로 운영되는 경우가 많습니다');
    return result;
  }

  result.status = 'possible';
  result.reasons.push('본인 직업과 나이 조건 기준으로 체증식 검토 가능성이 있습니다');
  result.notes.push('직장인은 미래 소득 증가를 전제로 체증식 검토가 가능합니다');
  result.notes.push('실제 상품별(디딤돌/보금자리론) 세부 요건은 금융기관 확인이 필요합니다');

  return result;
}
