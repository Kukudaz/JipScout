import { 
  UserProfile, 
  Property, 
  FinalLoanSummary, 
  LoanProductResult,
  UserProfileInput,
  PropertyInput
} from '@/types';
import { parseNumber } from '@/lib/format';
import { assessNewbornSpecial } from '@/lib/eligibility/newborn';
import { assessDidimdol } from '@/lib/eligibility/didimdol';
import { assessBogeumjari } from '@/lib/eligibility/bogeumjari';
import { assessBankMortgage } from '@/lib/eligibility/bankMortgage';
import { assessGraduatedRepayment } from '@/lib/eligibility/repayment';

// Convert string form inputs to number calculation types
export function parseUserProfile(input: UserProfileInput): UserProfile {
  return {
    myIncome: parseNumber(input.myIncome),
    spouseIncome: parseNumber(input.spouseIncome),
    cash: parseNumber(input.cash),
    existingDebtPayment: parseNumber(input.existingDebtPayment),
    age: parseNumber(input.age),
    jobType: input.jobType,
    marriageStatus: input.marriageStatus,
    isFirstTimeBuyer: input.isFirstTimeBuyer,
    isHomeless: input.isHomeless,
    newbornWithin2Years: input.newbornWithin2Years,
    childrenCount: parseNumber(input.childrenCount),
    wantsGraduatedRepayment: input.wantsGraduatedRepayment,
  };
}

export function parseProperty(input: PropertyInput): Property {
  return {
    homePrice: parseNumber(input.homePrice),
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

  // Assess each loan product
  const newbornSpecial = assessNewbornSpecial(user, property);
  const didimdol = assessDidimdol(user, property);
  const bogeumjari = assessBogeumjari(user, property);
  const bankMortgage = assessBankMortgage(user, property);
  const repayment = assessGraduatedRepayment(user);

  // Determine final estimated loan amount
  // Priority: newbornSpecial > bogeumjari > didimdol > bankMortgage
  let finalEstimatedLoanAmount = 0;
  
  if (newbornSpecial.status === 'possible' && newbornSpecial.amount > 0) {
    finalEstimatedLoanAmount = newbornSpecial.amount;
  } else if (bogeumjari.status === 'possible' && bogeumjari.amount > 0) {
    finalEstimatedLoanAmount = bogeumjari.amount;
  } else if (didimdol.status === 'possible' && didimdol.amount > 0) {
    finalEstimatedLoanAmount = didimdol.amount;
  } else if (bankMortgage.status === 'possible' && bankMortgage.amount > 0) {
    finalEstimatedLoanAmount = bankMortgage.amount;
  } else {
    // If nothing is fully possible, take the max of conditional amounts
    const conditionalAmounts = [
      newbornSpecial.status !== 'difficult' ? newbornSpecial.amount : 0,
      bogeumjari.status !== 'difficult' ? bogeumjari.amount : 0,
      didimdol.status !== 'difficult' ? didimdol.amount : 0,
      bankMortgage.amount,
    ];
    finalEstimatedLoanAmount = Math.max(...conditionalAmounts);
  }

  const totalBuyingPower = user.cash + finalEstimatedLoanAmount;

  return {
    finalEstimatedLoanAmount,
    newbornSpecial,
    didimdol,
    bogeumjari,
    bankMortgage,
    repayment,
    totalBuyingPower,
    userCash: user.cash,
  };
}
