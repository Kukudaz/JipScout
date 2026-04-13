// Form Input Types (string-based for UX)
export type MarriageStatus = 'single' | 'newlywed' | 'married';
export type JobType = 'employee' | 'selfEmployed' | 'freelancer';
export type HousingStatus = 'homeless' | 'oneHome' | 'multiHome';
export type TransactionType = 'existing' | 'newBuild' | 'right';
export type RepaymentMethod = 'equalPrincipalInterest' | 'equalPrincipal' | 'graduated';
export type RateType = 'fixed' | 'mixed' | 'periodic' | 'variable';
export type LoanTermYear = 10 | 15 | 20 | 30 | 40 | 50;
export type HousingType = 'apartment' | 'villa' | 'multiplex' | 'detached' | 'officetel' | 'other';

// 22 필수 입력군 전체
export interface UserProfileInput {
  // 1) 생년월일
  birthDate: string;           // 'YYYY-MM-DD'

  // 2) 혼인 상태
  marriageStatus: MarriageStatus;

  // 3) 혼인일/결혼예정일 (조건부)
  marriageDate: string;

  // 4) 본인 연소득 (만원)
  myIncome: string;

  // 5) 배우자 연소득 (만원, 조건부)
  spouseIncome: string;

  // 직업
  jobType: JobType;
  spouseJobType: JobType;

  // 6) 미성년 자녀 수
  childrenCount: string;

  // 7) 최근 2년 내 출산/입양 여부
  newbornWithin2Years: boolean;

  // 8) 출산일/입양일 (조건부)
  newbornDate: string;

  // 9) 세대주 여부
  isHeadOfHousehold: boolean;

  // 10) 주택 보유 상태
  housingStatus: HousingStatus;

  // 11) 분양권/조합원입주권 보유 여부
  hasHousingRight: boolean;

  // 12) 순자산 (만원)
  netAssets: string;

  // 13) 신용점수
  creditScore: string;        // 대표 점수
  kcbScore: string;
  niceScore: string;
  showDetailedCreditScore: boolean;

  // 14) 기존 월 부채 상환액 (만원)
  existingDebtPayment: string;

  // 15) 기존 대출 종류 및 잔액 (조건부)
  hasExistingMortgage: boolean;
  existingMortgageBalance: string;
  hasJeonseLoan: boolean;
  jeonseLoanBalance: string;
  hasFundLoan: boolean;
  fundLoanBalance: string;
  creditLoanBalance: string;

  // 21) 생애최초 여부
  isFirstTimeBuyer: boolean;

  // 기존 호환 필드 (계산 엔진 사용)
  cash: string;
  isHomeless: boolean;          // housingStatus 파생
  wantsGraduatedRepayment: boolean;
  hasExistingFirstHomeLoan: boolean;
  hasUsedFirstTimeLoanBefore: boolean;
  existingFirstHomeLoanBalance: string;
  wantsNewbornRefinance: boolean;
  age: string;                  // birthDate 파생
  isBirthdayPassed: boolean;
}

export interface PropertyInput {
  // 16) 희망 주택 가격 (만원)
  homePrice: string;
  kbPrice: string;

  // 17) 주택 유형
  housingType: HousingType;

  // 18) 전용면적 (㎡)
  exclusiveArea: string;

  // 19) 주택 소재지
  region: string;               // 시/도
  district: string;             // 시/군/구
  isCapitalArea: boolean;
  isRegulatedArea: boolean;

  // 20) 계약 관련 날짜 (조건부)
  transactionType: TransactionType;
  contractDate: string;
  contractDepositDate: string;
  recruitAnnouncementDate: string;

  // 22) 희망 대출 조건
  loanTermYears: string;
  repaymentMethod: RepaymentMethod;
  rateType: RateType;
}

// Calculation Types (number-based for logic)
export interface UserProfile {
  myIncome: number;
  spouseIncome: number;
  cash: number;
  existingDebtPayment: number;
  age: number;
  isBirthdayPassed: boolean;
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