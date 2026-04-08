export type MarriageStatus = 'single' | 'newlywed' | 'married';
export type JobType = 'employee' | 'selfEmployed' | 'freelancer';
export type RegionType = 'seoulMetro' | 'nonSeoul';

export interface FinancialInfo {
  myIncome: number;
  spouseIncome: number;
  cash: number;
  existingDebtPayment: number;
  isFirstTimeBuyer: boolean;
  isHomeless: boolean;
  marriageStatus: MarriageStatus;
  jobType: JobType;
  age: number;
  regionType: RegionType;
  isSteppingInterest: boolean;
}

export interface HousingCondition {
  targetPrice: number;
}

export interface LoanAssessment {
  eligibility: 'possible' | 'conditional' | 'difficult';
  amount: number;
  reason: string;
}

export interface CalculationResult {
  totalIncome: number;
  cash: number;
  finalEstimatedLoan: number;
  didimdol: LoanAssessment;
  bogeumjari: LoanAssessment;
  regularMortgage: LoanAssessment;
  steppingEligible: boolean;
  steppingReason: string;
  totalPurchasingPower: number;
}
