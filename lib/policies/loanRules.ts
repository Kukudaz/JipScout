// 모든 금액 단위: 만원
export const LOAN_LIMITS = {
  newbornSpecial: {
    maxLoan: 40000, // 4억
    maxPrice: 90000, // 9억
    maxIncome: 13000, // 1.3억
    maxIncomeDual: 20000, // 맞벌이 2억
    defaultLtv: 0.7,
    firstTimeLtvCapitalOrRegulated: 0.7,
    firstTimeLtvNonCapitalNonRegulated: 0.8,
  },
  didimdol: {
    defaultMaxLoan: 20000, // 2억
    firstTimeMaxLoan: 24000, // 2.4억
    marriedOrMultiChildMaxLoan: 32000, // 3.2억
    defaultMaxPrice: 50000, // 5억
    marriedOrMultiChildMaxPrice: 60000, // 6억
    defaultMaxIncome: 6000, // 6천
    firstTimeMaxIncome: 7000, // 7천
    marriedOrMultiChildMaxIncome: 7000, // 7천
    newlywedMaxIncome: 8500, // 8,500
    defaultLtv: 0.7,
    firstTimeLtvCapitalOrRegulated: 0.7,
    firstTimeLtvNonCapitalNonRegulated: 0.8,
  },
  bogeumjari: {
    defaultMaxLoan: 36000, // 3.6억
    firstTimeMaxLoan: 42000, // 4.2억
    maxPrice: 60000, // 6억
    defaultMaxIncome: 7000, // 7천
    newlywedMaxIncome: 8500, // 8,500
    defaultLtv: 0.7,
    regulatedAreaLtvDeduction: 0.1,
  },
};

export const BANK_MORTGAGE_RULES = {
  monthlyRepaymentRatio: 0.35,
  annualInterestRate: 0.045,
  loanTermYears: 30,
  regulatedAreaLtv: 0.6,
  nonRegulatedAreaLtv: 0.7,
};

export const GRADUATED_REPAYMENT = {
  maxAgeExclusive: 40, // 만 40세 미만
  allowedJobTypes: ['employee'] as const,
};

export const isDualIncome = (myIncome: number, spouseIncome: number) => myIncome > 0 && spouseIncome > 0;
export const isMarriedLike = (marriageStatus: 'single' | 'newlywed' | 'married') => marriageStatus === 'newlywed' || marriageStatus === 'married';
