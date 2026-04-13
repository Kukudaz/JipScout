import { calculateLoanSummary } from '../lib/calculator';
import { UserProfileInput, PropertyInput } from '../types';

const defaultUserExtras: Partial<UserProfileInput> = {
  birthDate: '1992-01-01',
  marriageDate: '',
  newbornDate: '',
  isHeadOfHousehold: true,
  housingStatus: 'homeless',
  hasHousingRight: false,
  netAssets: '10000',
  creditScore: '900',
  showDetailedCreditScore: false,
  hasExistingMortgage: false,
  existingMortgageBalance: '0',
  hasJeonseLoan: false,
  jeonseLoanBalance: '0',
  hasFundLoan: false,
  fundLoanBalance: '0',
  creditLoanBalance: '0',
};

const defaultPropertyExtras: Partial<PropertyInput> = {
  housingType: 'apartment',
  region: '',
  district: '',
  transactionType: 'existing',
  contractDate: '',
  contractDepositDate: '',
  recruitAnnouncementDate: '',
  loanTermYears: '30',
  repaymentMethod: 'equalPrincipalInterest',
  rateType: 'fixed',
};

const cases: { name: string; user: UserProfileInput; property: PropertyInput }[] = [
  {
    name: 'Case 1: Newborn Miracle (Target: Newborn Special)',
    user: {
      ...defaultUserExtras,
      myIncome: '8000',
      spouseIncome: '7000',
      cash: '20000',
      existingDebtPayment: '0',
      age: '32',
      isBirthdayPassed: true,
      jobType: 'employee',
      spouseJobType: 'employee',
      marriageStatus: 'newlywed',
      isFirstTimeBuyer: true,
      isHomeless: true,
      newbornWithin2Years: true,
      childrenCount: '1',
      wantsGraduatedRepayment: false,
      hasExistingFirstHomeLoan: false,
      hasUsedFirstTimeLoanBefore: false,
      existingFirstHomeLoanBalance: '0',
      wantsNewbornRefinance: false,
      niceScore: '900',
      kcbScore: '900',
    } as UserProfileInput,
    property: {
      ...defaultPropertyExtras,
      homePrice: '80000',
      kbPrice: '82000',
      exclusiveArea: '84',
      isCapitalArea: true,
      isRegulatedArea: false,
    } as PropertyInput,
  },
  {
    name: 'Case 2: First-Time Buyer Non-Capital (Target: Didimdol 80% LTV)',
    user: {
      ...defaultUserExtras,
      myIncome: '5000',
      spouseIncome: '0',
      cash: '8000',
      existingDebtPayment: '0',
      age: '35',
      isBirthdayPassed: true,
      jobType: 'employee',
      spouseJobType: 'employee',
      marriageStatus: 'single',
      isFirstTimeBuyer: true,
      isHomeless: true,
      newbornWithin2Years: false,
      childrenCount: '0',
      wantsGraduatedRepayment: false,
      hasExistingFirstHomeLoan: false,
      hasUsedFirstTimeLoanBefore: false,
      existingFirstHomeLoanBalance: '0',
      wantsNewbornRefinance: false,
      niceScore: '850',
      kcbScore: '850',
    } as UserProfileInput,
    property: {
      ...defaultPropertyExtras,
      homePrice: '40000',
      kbPrice: '0',
      exclusiveArea: '59',
      isCapitalArea: false,
      isRegulatedArea: false,
    } as PropertyInput,
  },
  {
    name: 'Case 3: Upper Middle Class (Target: Bank Mortgage, Stress DSR)',
    user: {
      ...defaultUserExtras,
      myIncome: '12000',
      spouseIncome: '10000',
      cash: '40000',
      existingDebtPayment: '0',
      age: '40',
      isBirthdayPassed: true,
      jobType: 'employee',
      spouseJobType: 'employee',
      marriageStatus: 'married',
      isFirstTimeBuyer: false,
      isHomeless: true,
      newbornWithin2Years: false,
      childrenCount: '1',
      wantsGraduatedRepayment: false,
      hasExistingFirstHomeLoan: false,
      hasUsedFirstTimeLoanBefore: false,
      existingFirstHomeLoanBalance: '0',
      wantsNewbornRefinance: false,
      niceScore: '950',
      kcbScore: '950',
    } as UserProfileInput,
    property: {
      ...defaultPropertyExtras,
      homePrice: '120000',
      kbPrice: '125000',
      exclusiveArea: '101',
      isCapitalArea: true,
      isRegulatedArea: false,
    } as PropertyInput,
  },
  {
    name: 'Case 4: High Debt Edge (Target: DSR Limit Check)',
    user: {
      ...defaultUserExtras,
      myIncome: '4000',
      spouseIncome: '0',
      cash: '10000',
      existingDebtPayment: '180',
      age: '30',
      isBirthdayPassed: true,
      jobType: 'employee',
      spouseJobType: 'employee',
      marriageStatus: 'single',
      isFirstTimeBuyer: true,
      isHomeless: true,
      newbornWithin2Years: false,
      childrenCount: '0',
      wantsGraduatedRepayment: false,
      hasExistingFirstHomeLoan: false,
      hasUsedFirstTimeLoanBefore: false,
      existingFirstHomeLoanBalance: '0',
      wantsNewbornRefinance: false,
      niceScore: '800',
      kcbScore: '800',
    } as UserProfileInput,
    property: {
      ...defaultPropertyExtras,
      homePrice: '50000',
      kbPrice: '50000',
      exclusiveArea: '59',
      isCapitalArea: true,
      isRegulatedArea: false,
    } as PropertyInput,
  },
  {
    name: 'Case 5: Age Restriction check (Age 42, Graduated Repayment)',
    user: {
      ...defaultUserExtras,
      myIncome: '6000',
      spouseIncome: '0',
      cash: '15000',
      existingDebtPayment: '0',
      age: '42',
      isBirthdayPassed: true,
      jobType: 'employee',
      spouseJobType: 'employee',
      marriageStatus: 'single',
      isFirstTimeBuyer: true,
      isHomeless: true,
      newbornWithin2Years: false,
      childrenCount: '0',
      wantsGraduatedRepayment: true,
      hasExistingFirstHomeLoan: false,
      hasUsedFirstTimeLoanBefore: false,
      existingFirstHomeLoanBalance: '0',
      wantsNewbornRefinance: false,
      niceScore: '900',
      kcbScore: '900',
    } as UserProfileInput,
    property: {
      ...defaultPropertyExtras,
      homePrice: '60000',
      kbPrice: '60000',
      exclusiveArea: '84',
      isCapitalArea: true,
      isRegulatedArea: false,
    } as PropertyInput,
  },
];

console.log('--- Start Backtesting ---');
cases.forEach((c) => {
  const result = calculateLoanSummary(c.user, c.property);
  console.log(`\n[${c.name}]`);
  console.log(`- Final Loan Amount: ${result.finalEstimatedLoanAmount.toLocaleString()}만원`);
  console.log(`- Total Buying Power: ${result.totalBuyingPower.toLocaleString()}만원 (Cash: ${result.userCash}만원)`);
  
  console.log(`  > Newborn: ${result.newbornSpecial.status} / Amount: ${result.newbornSpecial.amount.toLocaleString()}만원`);
  if (result.newbornSpecial.failReasons.length > 0) console.log(`    Reason: ${result.newbornSpecial.failReasons.join(', ')}`);
  
  console.log(`  > Didimdol: ${result.didimdol.status} / Amount: ${result.didimdol.amount.toLocaleString()}만원`);
  if (result.didimdol.failReasons.length > 0) console.log(`    Reason: ${result.didimdol.failReasons.join(', ')}`);
  
  console.log(`  > Bogeumjari: ${result.bogeumjari.status} / Amount: ${result.bogeumjari.amount.toLocaleString()}만원`);
  if (result.bogeumjari.failReasons.length > 0) console.log(`    Reason: ${result.bogeumjari.failReasons.join(', ')}`);

  console.log(`  > Bank Mortgage: ${result.bankMortgage.status} / Amount: ${result.bankMortgage.amount.toLocaleString()}만원`);
  if (result.bankMortgage.failReasons.length > 0) console.log(`    Reason: ${result.bankMortgage.failReasons.join(', ')}`);

  if (c.user.wantsGraduatedRepayment) {
    console.log(`  > Graduated Repayment: ${result.repayment.status}`);
    if (result.repayment.notes.length > 0) console.log(`    Note: ${result.repayment.notes.join(', ')}`);
  }
});
console.log('\n--- Backtesting Finished ---');
