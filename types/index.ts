// Form Input Types (string-based for UX)
export type MarriageStatus = 'single' | 'newlywed' | 'married';
export type JobType = 'employee' | 'selfEmployed' | 'freelancer';

export interface UserProfileInput {
  myIncome: string;
  spouseIncome: string;
  cash: string;
  existingDebtPayment: string;
  age: string;
  jobType: JobType;
  spouseJobType: JobType;
  marriageStatus: MarriageStatus;
  isFirstTimeBuyer: boolean;
  isHomeless: boolean;
  newbornWithin2Years: boolean;
  childrenCount: string;
  wantsGraduatedRepayment: boolean;
  hasExistingFirstHomeLoan: boolean;
  hasUsedFirstTimeLoanBefore: boolean;
  existingFirstHomeLoanBalance: string;
  wantsNewbornRefinance: boolean;
  niceScore: string;
  kcbScore: string;
}

export interface PropertyInput {
  homePrice: string;
  kbPrice: string;
  exclusiveArea: string;
  isCapitalArea: boolean;
  isRegulatedArea: boolean;
}

// Calculation Types (number-based for logic)
export interface UserProfile {
  myIncome: number;
  spouseIncome: number;
  cash: number;
  existingDebtPayment: number;
  age: number;
  jobType: JobType;
  spouseJobType: JobType;
  marriageStatus: MarriageStatus;
  isFirstTimeBuyer: boolean;
  isHomeless: boolean;
  newbornWithin2Years: boolean;
  childrenCount: number;
  wantsGraduatedRepayment: boolean;
  hasExistingFirstHomeLoan: boolean;
  hasUsedFirstTimeLoanBefore: boolean;
  existingFirstHomeLoanBalance: number;
  wantsNewbornRefinance: boolean;
  niceScore: number;
  kcbScore: number;
}

export interface Property {
  homePrice: number;
  kbPrice: number;
  exclusiveArea: number;
  isCapitalArea: boolean;
  isRegulatedArea: boolean;
}

// Result Types
export type EligibilityStatus = 'possible' | 'conditional' | 'difficult';


export interface RepaymentComparison {
  equalMonthlyPayment: number;
  graduatedInitialMonthlyPayment: number;
  graduatedEstimatedLaterPayment: number;
  savingsAtStart: number;
  projectionYears: number;
  assumptionNote: string;
}

export interface LoanProductResult {
  productName: string;
  status: EligibilityStatus;
  amount: number;
  reasons: string[];
  failReasons: string[];
  notes: string[];
}

export interface RepaymentResult {
  status: EligibilityStatus;
  reasons: string[];
  notes: string[];
}

export interface FinalLoanSummary {
  finalEstimatedLoanAmount: number;
  newbornSpecial: LoanProductResult;
  didimdol: LoanProductResult;
  bogeumjari: LoanProductResult;
  bankMortgage: LoanProductResult;
  repayment: RepaymentResult;
  repaymentComparison: RepaymentComparison | null;
  totalBuyingPower: number;
  userCash: number;
}
