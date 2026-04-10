import {
  UserProfile,
  Property,
  FinalLoanSummary,
  LoanProductResult,
  UserProfileInput,
  PropertyInput,
} from '@/types';
import { parseNumber } from '@/lib/format';
import { assessNewbornSpecial } from '@/lib/eligibility/newborn';
import { assessDidimdol } from '@/lib/eligibility/didimdol';
import { assessBogeumjari } from '@/lib/eligibility/bogeumjari';
import { assessBankMortgage } from '@/lib/eligibility/bankMortgage';
import { assessGraduatedRepayment } from '@/lib/eligibility/repayment';
import { calculateRepaymentComparison } from '@/lib/repaymentCalculator';
import { BANK_MORTGAGE_RULES, MARKET_RATE_CONFIG } from '@/lib/policies/loanRules';

// Convert string form inputs to number calculation types
export function parseUserProfile(input: UserProfileInput): UserProfile {
  return {
    myIncome: parseNumber(input.myIncome),
    spouseIncome: parseNumber(input.spouseIncome),
    cash: parseNumber(input.cash),
    existingDebtPayment: parseNumber(input.existingDebtPayment),
    age: parseNumber(input.age),
    jobType: input.jobType,
    spouseJobType: input.spouseJobType,
    marriageStatus: input.marriageStatus,
    isFirstTimeBuyer: input.isFirstTimeBuyer,
    isHomeless: input.isHomeless,
    newbornWithin2Years: input.newbornWithin2Years,
    childrenCount: parseNumber(input.childrenCount),
    wantsGraduatedRepayment: input.wantsGraduatedRepayment,
    hasExistingFirstHomeLoan: input.hasExistingFirstHomeLoan,
    hasUsedFirstTimeLoanBefore: input.hasUsedFirstTimeLoanBefore,
    existingFirstHomeLoanBalance: parseNumber(input.existingFirstHomeLoanBalance),
    wantsNewbornRefinance: input.wantsNewbornRefinance,
    niceScore: parseNumber(input.niceScore),
    kcbScore: parseNumber(input.kcbScore),
  };
}

export function parseProperty(input: PropertyInput): Property {
  return {
    homePrice: parseNumber(input.homePrice),
    kbPrice: parseNumber(input.kbPrice),
    exclusiveArea: parseNumber(input.exclusiveArea),
    isCapitalArea: input.isCapitalArea,
    isRegulatedArea: input.isRegulatedArea,
  };
}

// Main calculation function
export function calculateLoanSummary(
  userProfileInput: UserProfileInput,
  propertyInput: PropertyInput
): FinalLoanSummary {
  const user = parseUserProfile(userProfileInput);
  const property = parseProperty(propertyInput);

  const newbornSpecial = assessNewbornSpecial(user, property);
  const didimdol = assessDidimdol(user, property);
  const bogeumjari = assessBogeumjari(user, property);
  const bankMortgage = assessBankMortgage(user, property);
  const repayment = assessGraduatedRepayment(user);

  const stressRate = property.isCapitalArea ? 0 : MARKET_RATE_CONFIG.nonCapitalStressRate;
  const appliedAnnualRate = MARKET_RATE_CONFIG.baseMortgageAnnualRate + stressRate;
  const repaymentComparison =
    user.wantsGraduatedRepayment &&
    repayment.status !== 'difficult' &&
    bankMortgage.amount > 0
      ? calculateRepaymentComparison(
          bankMortgage.amount,
          appliedAnnualRate,
          BANK_MORTGAGE_RULES.loanTermYears
        )
      : null;

  const allProducts: LoanProductResult[] = [newbornSpecial, didimdol, bogeumjari, bankMortgage];
  const finalEstimatedLoanAmount = Math.max(
    ...allProducts.map((item) => (item.status !== 'difficult' ? item.amount : 0))
  );

  const totalBuyingPower = user.cash + finalEstimatedLoanAmount;

  return {
    finalEstimatedLoanAmount,
    newbornSpecial,
    didimdol,
    bogeumjari,
    bankMortgage,
    repayment,
    repaymentComparison,
    totalBuyingPower,
    userCash: user.cash,
  };
}
