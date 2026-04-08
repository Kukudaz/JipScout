// Policy Rules - Korean Housing Loan Policies
// All amounts in 만원 (10,000 KRW)

export const LOAN_LIMITS = {
  newbornSpecial: {
    maxLoan: 50000, // 5억
    maxPrice: 80000, // 8억
    maxIncome: 12000, // 1.2억 (생애최초), 1.5억 (신혼/신규출산)
    maxIncomeNewlywed: 15000, // 1.5억
    ltvRatio: 0.8,
  },
  didimdol: {
    maxLoan: 25000, // 2.5억
    maxPrice: 50000, // 5억
    maxIncome: 7000, // 7천만원
    ltvRatio: 0.7,
  },
  bogeumjari: {
    maxLoan: 40000, // 4억
    maxPrice: 60000, // 6억
    maxIncome: 8000, // 8천만원
    ltvRatio: 0.7,
  },
} as const;

export const LTV_RULES = {
  regulatedArea: {
    firstTime: 0.8,
    general: 0.7,
  },
  nonRegulatedArea: {
    firstTime: 0.8,
    general: 0.8,
  },
} as const;

export const DTI_RATIO = 0.4; // Debt to Income ratio
export const LOAN_INTEREST_RATE = 0.05; // 5% annual interest
export const LOAN_TERM_YEARS = 20;

export const GRADUATED_REPAYMENT = {
  minAge: 25,
  maxAge: 45,
  allowedJobTypes: ['employee'] as const,
} as const;

// Policy check functions
export const checkNewbornSpecialEligibility = (
  newbornWithin2Years: boolean,
  childrenCount: number
): boolean => {
  return newbornWithin2Years || childrenCount > 0;
};

export const checkDidimdolEligibility = (
  isHomeless: boolean,
  isFirstTimeBuyer: boolean
): boolean => {
  return isHomeless && isFirstTimeBuyer;
};

export const checkBogeumjariEligibility = (
  isHomeless: boolean,
  isFirstTimeBuyer: boolean
): boolean => {
  return isHomeless && isFirstTimeBuyer;
};

export const getLtvRatio = (
  isFirstTimeBuyer: boolean,
  isRegulatedArea: boolean
): number => {
  if (isRegulatedArea) {
    return isFirstTimeBuyer ? LTV_RULES.regulatedArea.firstTime : LTV_RULES.regulatedArea.general;
  }
  return isFirstTimeBuyer ? LTV_RULES.nonRegulatedArea.firstTime : LTV_RULES.nonRegulatedArea.general;
};
