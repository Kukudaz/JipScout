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

  // Check age requirement (under 40)
  if (user.age >= GRADUATED_REPAYMENT.maxAgeExclusive) {
    result.status = 'difficult';
    result.reasons.push('만 40세 미만 조건에 해당하지 않습니다');
    return result;
  }

  // Check job type requirement
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

    result.status = 'conditional';
    result.reasons.push('현재 입력 기준으로 근로소득자 요건 확인이 필요합니다');
    result.notes.push('자영업자/프리랜서는 체증식 적용이 제한될 수 있습니다');
    return result;
  }

  result.status = 'possible';
  result.reasons.push('만 40세 미만 근로소득자 기준에 가까워 체증식 검토 가능성이 있습니다');
  result.notes.push('디딤돌은 고정금리 선택 시 가능 여부를 함께 확인해야 합니다');
  result.notes.push('보금자리론은 공사 사전심사 여부 등 추가 조건 확인이 필요합니다');

  return result;
}
