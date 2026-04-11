// 모든 금액 단위: 만원
export const LOAN_LIMITS = {
  newbornSpecial: {
    maxLoan: 50000, // 5억
    maxPrice: 90000, // 9억
    maxIncome: 13000, // 1.3억
    maxIncomeDual: 20000, // 맞벌이 2억
    defaultLtv: 0.7,
    firstTimeLtvCapitalOrRegulated: 0.7,
    firstTimeLtvNonCapitalNonRegulated: 0.8,
  },
  newbornSpecialRefinanceException: {
    kbPriceLimit: 60000, // KB시세 6억
    maxLoan: 50000, // 최대 5억
    fixedLtv: 0.7,
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

export const LOAN_PRODUCT_GUIDES = {
  newbornSpecial: {
    ltv: '기본 LTV 70%, 비수도권·비규제 생애최초는 80% 가능 (재대출 예외 시 70% 고정)',
    rate: '금리 안내: 정책상품 특성상 연 1~4%대 범위에서 심사 조건별 변동',
    maxLimit: '최대 한도: 최대 5억원',
    keyConditions: [
      '2년 내 출산, 무주택, 전용면적 85㎡ 이하',
      '소득 기준: 단독 1.3억 이하 / 맞벌이(부부합산) 2억 이하',
      '생애최초 사용 이력 재대출은 KB시세 6억원 이하 기준',
    ],
  },
  didimdol: {
    ltv: '기본 LTV 70%, 비수도권·비규제 생애최초는 80% 가능',
    rate: '금리 안내: 통상 연 2~4%대, 소득/만기/우대조건에 따라 변동',
    maxLimit: '최대 한도: 일반 2억, 생애최초 2.4억, 신혼·다자녀 3.2억',
    keyConditions: ['무주택', '소득 기준 충족', '생애최초·신혼·다자녀 우대 반영'],
  },
  bogeumjari: {
    ltv: '기본 LTV 70%, 규제지역 비생애최초는 차감(60% 가능)',
    rate: '금리 안내: 통상 연 3~5%대, 상품 유형·우대금리에 따라 변동',
    maxLimit: '최대 한도: 일반 3.6억, 생애최초 4.2억',
    keyConditions: ['주택가격 6억원 이하', '소득 기준 충족', '만기 40/50년 가능성은 나이·혼인상태 영향'],
  },
  bankMortgage: {
    ltv: '규제지역 60%, 비규제지역 70% 기준으로 보수 계산',
    rate: '현재 계산 기준(가정 금리) + 비수도권 스트레스 금리 0.75%p 반영',
    maxLimit: '최대 한도: LTV·상환여력·현금부족분 중 가장 보수적인 값 적용',
    keyConditions: ['소득 대비 월 상환여력 반영', '기존 부채 상환액 반영(스트레스 금리 포함)', '실제 심사 시 금리/한도 변동 가능'],
  },
} as const;

export const BANK_MORTGAGE_RULES = {
  monthlyRepaymentRatio: 0.35,
  loanTermYears: 30,
  regulatedAreaLtv: 0.6,
  nonRegulatedAreaLtv: 0.7,
};

export const GRADUATED_REPAYMENT = {
  maxAgeExclusive: 40,
  allowedJobTypes: ['employee'] as const,
  initialPaymentRatio: 0.75,
  annualIncreaseRate: 0.06,
  increaseIntervalYears: 1,
  maxTermYears: 30,
  laterPaymentProjectionYears: 5,
  supportedProducts: ['일반 주담대'] as const,
  displayAssumption: '체증식 비교는 초기 상환부담 완화(원리금균등의 75% 시작), 연 6% 증가 가정의 참고치입니다.',
};

export const MARKET_RATE_CONFIG = {
  baseMortgageAnnualRate: 0.045,
  nonCapitalStressRate: 0.0075,
  capitalStressRate: 0.015,
  updatedAt: '2026-04-12',
  source: '관리자 설정값(정책 파일)',
} as const;

export const isDualIncome = (myIncome: number, spouseIncome: number) => myIncome > 0 && spouseIncome > 0;
export const isMarriedLike = (marriageStatus: 'single' | 'newlywed' | 'married') => marriageStatus === 'newlywed' || marriageStatus === 'married';
