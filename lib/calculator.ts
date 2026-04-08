import { FinancialInfo, HousingCondition, CalculationResult, LoanAssessment, RegionType } from '@/types';

const DTI_RATIO = 0.4;
const LOAN_INTEREST_RATE = 0.05;
const LOAN_TERM_YEARS = 20;

const DIDIMDOL_LIMIT = 25000;
const BOGEUMJARI_LIMIT = 40000;

export function calculateMaxLoanFromIncome(totalIncome: number, existingDebtPayment: number): number {
  const monthlyIncome = totalIncome / 12;
  const maxMonthlyPayment = monthlyIncome * DTI_RATIO - existingDebtPayment;
  const monthlyRate = LOAN_INTEREST_RATE / 12;
  const numPayments = LOAN_TERM_YEARS * 12;
  if (maxMonthlyPayment <= 0) return 0;
  const loanAmount = maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate;
  return Math.floor(loanAmount);
}

export function assessDidimdol(
  financial: FinancialInfo,
  targetPrice: number
): LoanAssessment {
  const totalIncome = financial.myIncome + financial.spouseIncome;
  const isEligible = financial.isHomeless && financial.isFirstTimeBuyer;
  const isNewlywedOrMarried = financial.marriageStatus !== 'single';
  const withinPriceLimit = targetPrice <= 50000;
  const withinIncomeLimit = totalIncome <= 7000;
  const isSeoulMetro = financial.regionType === 'seoulMetro';

  if (!isEligible) {
    return { eligibility: 'difficult', amount: 0, reason: '무주택 및 생애최초 조건 미충족' };
  }
  if (!withinPriceLimit) {
    return { eligibility: 'difficult', amount: 0, reason: '주택 가격 기준 초과' };
  }
  if (!withinIncomeLimit) {
    return { eligibility: 'difficult', amount: 0, reason: '소득 기준 초과' };
  }

  const maxLoan = Math.min(DIDIMDOL_LIMIT, targetPrice * 0.8);
  const incomeBased = calculateMaxLoanFromIncome(totalIncome, financial.existingDebtPayment);
  const amount = Math.min(maxLoan, incomeBased);

  let reason = '정부대출 가능';
  if (isNewlywedOrMarried) {
    reason = '신혼/부부 우대 혜택 적용 가능';
  }
  if (isSeoulMetro) {
    reason += ' (수도권 규제지역 해당 시 별도 확인 필요)';
  }

  return { eligibility: 'possible', amount, reason };
}

export function assessBogeumjari(
  financial: FinancialInfo,
  targetPrice: number
): LoanAssessment {
  const totalIncome = financial.myIncome + financial.spouseIncome;
  const isEligible = financial.isHomeless && financial.isFirstTimeBuyer;
  const withinPriceLimit = targetPrice <= 60000;
  const withinIncomeLimit = totalIncome <= 8000;
  const isSeoulMetro = financial.regionType === 'seoulMetro';

  if (!isEligible) {
    return { eligibility: 'difficult', amount: 0, reason: '무주택 및 생애최초 조건 미충족' };
  }
  if (!withinPriceLimit || !withinIncomeLimit) {
    return { eligibility: 'conditional', amount: 0, reason: '기준 초과로 한도 제한 가능' };
  }

  const maxLoan = Math.min(BOGEUMJARI_LIMIT, targetPrice * 0.7);
  const incomeBased = calculateMaxLoanFromIncome(totalIncome, financial.existingDebtPayment);
  const amount = Math.min(maxLoan, incomeBased);

  let reason = '보금자리론 가능';
  if (isSeoulMetro) {
    reason += ' (수도권 규제지역 해당 시 한도 제한 가능)';
  }

  return { eligibility: amount > 0 ? 'possible' : 'conditional', amount, reason };
}

export function assessRegularMortgage(
  financial: FinancialInfo,
  targetPrice: number
): LoanAssessment {
  const totalIncome = financial.myIncome + financial.spouseIncome;
  const ltvRatio = financial.regionType === 'seoulMetro' ? 0.7 : 0.8;
  const maxLtv = targetPrice * ltvRatio;
  const incomeBased = calculateMaxLoanFromIncome(totalIncome, financial.existingDebtPayment);
  const cashGap = Math.max(0, targetPrice - financial.cash);
  const amount = Math.min(maxLtv, incomeBased, cashGap);

  if (amount <= 0) {
    return { eligibility: 'difficult', amount: 0, reason: '상환 능력 또는 LTV 기준 미달' };
  }

  let reason = '일반 주담대 검토 가능';
  if (financial.jobType === 'selfEmployed') {
    reason = '자영업자는 소득 입증 상태에 따라 실제 결과가 달라질 수 있습니다';
  }

  return { eligibility: 'possible', amount, reason };
}

export function assessStepping(
  financial: FinancialInfo
): { eligible: boolean; reason: string } {
  if (!financial.isSteppingInterest) {
    return { eligible: false, reason: '' };
  }
  if (financial.age < 25 || financial.age > 45) {
    return { eligible: false, reason: '체증식은 25~45세 사이에 가능합니다' };
  }
  if (financial.jobType !== 'employee') {
    return { eligible: false, reason: '체증식은 직장인에 한해 가능합니다' };
  }
  return { eligible: true, reason: '체증식 대출 가능 (초기 저금리, 이후 점진적 증액)' };
}

export function calculateResults(
  financial: FinancialInfo,
  housing: HousingCondition
): CalculationResult {
  const totalIncome = financial.myIncome + financial.spouseIncome;

  const didimdol = assessDidimdol(financial, housing.targetPrice);
  const bogeumjari = assessBogeumjari(financial, housing.targetPrice);
  const regularMortgage = assessRegularMortgage(financial, housing.targetPrice);
  const stepping = assessStepping(financial);

  const governmentLoan = Math.max(didimdol.amount, bogeumjari.amount);
  const finalEstimatedLoan = governmentLoan > 0 ? governmentLoan : regularMortgage.amount;

  const totalPurchasingPower = financial.cash + finalEstimatedLoan;

  return {
    totalIncome,
    cash: financial.cash,
    finalEstimatedLoan,
    didimdol,
    bogeumjari,
    regularMortgage,
    steppingEligible: stepping.eligible,
    steppingReason: stepping.reason,
    totalPurchasingPower,
  };
}
