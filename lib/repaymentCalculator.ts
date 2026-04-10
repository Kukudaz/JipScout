import { GRADUATED_REPAYMENT } from '@/lib/policies/loanRules';

export interface RepaymentComparison {
  equalMonthlyPayment: number;
  graduatedInitialMonthlyPayment: number;
  graduatedEstimatedLaterPayment: number;
  savingsAtStart: number;
  projectionYears: number;
  assumptionNote: string;
}

export function calculateEqualMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  if (principal <= 0 || annualRate <= 0 || termYears <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12;
  const n = termYears * 12;
  return principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -n)));
}

export function calculateRepaymentComparison(
  principal: number,
  annualRate: number,
  termYears: number
): RepaymentComparison | null {
  if (principal <= 0) {
    return null;
  }

  const equalMonthlyPayment = calculateEqualMonthlyPayment(principal, annualRate, termYears);
  if (equalMonthlyPayment <= 0) {
    return null;
  }

  const initialRatio = GRADUATED_REPAYMENT.initialPaymentRatio;
  const projectionYears = Math.min(
    GRADUATED_REPAYMENT.laterPaymentProjectionYears,
    Math.max(1, termYears)
  );

  const graduatedInitialMonthlyPayment = equalMonthlyPayment * initialRatio;
  const graduatedEstimatedLaterPayment =
    graduatedInitialMonthlyPayment *
    Math.pow(1 + GRADUATED_REPAYMENT.annualIncreaseRate, projectionYears);

  return {
    equalMonthlyPayment: Math.floor(equalMonthlyPayment),
    graduatedInitialMonthlyPayment: Math.floor(graduatedInitialMonthlyPayment),
    graduatedEstimatedLaterPayment: Math.floor(graduatedEstimatedLaterPayment),
    savingsAtStart: Math.floor(equalMonthlyPayment - graduatedInitialMonthlyPayment),
    projectionYears,
    assumptionNote: GRADUATED_REPAYMENT.displayAssumption,
  };
}
