'use client';

import { useState } from 'react';
import { UserProfileInput, PropertyInput, FinalLoanSummary } from '@/types';
import { calculateLoanSummary } from '@/lib/calculator';
import FinancialInput from '@/components/FinancialInput';
import HousingInput from '@/components/HousingInput';
import ResultCard from '@/components/ResultCard';
import { validateNumericFields } from '@/lib/validation';

const defaultUserProfile: UserProfileInput = {
  myIncome: '',
  spouseIncome: '',
  cash: '',
  existingDebtPayment: '',
  age: '',
  jobType: 'employee',
  spouseJobType: 'employee',
  marriageStatus: 'single',
  isFirstTimeBuyer: false,
  isHomeless: true,
  newbornWithin2Years: false,
  childrenCount: '',
  wantsGraduatedRepayment: false,
  hasExistingFirstHomeLoan: false,
  hasUsedFirstTimeLoanBefore: false,
  existingFirstHomeLoanBalance: '',
  wantsNewbornRefinance: false,
  niceScore: '',
  kcbScore: '',
};

const defaultProperty: PropertyInput = {
  homePrice: '',
  kbPrice: '',
  exclusiveArea: '',
  isCapitalArea: true,
  isRegulatedArea: false,
};

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfileInput>(defaultUserProfile);
  const [property, setProperty] = useState<PropertyInput>(defaultProperty);
  const [result, setResult] = useState<FinalLoanSummary | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateInputs = (): string[] => {
<<<<<<< HEAD
    const errors = validateNumericFields([
=======
    return validateNumericFields([
>>>>>>> origin/main
      { label: '본인 연소득', value: userProfile.myIncome, required: true, min: 0 },
      { label: '배우자 연소득', value: userProfile.spouseIncome, min: 0 },
      { label: '보유 현금', value: userProfile.cash, required: true, min: 0 },
      { label: '기존 월 부채 상환액', value: userProfile.existingDebtPayment, min: 0 },
      { label: '나이', value: userProfile.age, required: true, min: 19, max: 120 },
      { label: '자녀 수', value: userProfile.childrenCount, min: 0 },
<<<<<<< HEAD
      { label: '기존 생애최초 신혼부부 대출 잔액', value: userProfile.existingFirstHomeLoanBalance, min: 0 },
      { label: 'NICE 점수', value: userProfile.niceScore, min: 0, max: 1000 },
      { label: 'KCB 점수', value: userProfile.kcbScore, min: 0, max: 1000 },
      { label: '희망 매매가', value: property.homePrice, required: true, min: 1 },
      { label: 'KB시세', value: property.kbPrice, min: 1 },
      { label: '전용면적', value: property.exclusiveArea, required: true, min: 1 },
    ]);

    if (userProfile.wantsNewbornRefinance && !userProfile.hasExistingFirstHomeLoan) {
      errors.push('신생아 특례 갈아타기를 원하면 기존 생애최초 신혼부부 대출 여부를 체크해주세요');
    }

    if (userProfile.hasExistingFirstHomeLoan && userProfile.existingFirstHomeLoanBalance.trim() === '') {
      errors.push('기존 생애최초 신혼부부 대출 잔액을 입력해주세요');
    }

    if (userProfile.hasUsedFirstTimeLoanBefore && property.kbPrice.trim() === '') {
      errors.push('과거 생애최초 대출 사용 이력이 있으면 KB시세를 입력해주세요');
    }

    return errors;
=======
      { label: '희망 매매가', value: property.homePrice, required: true, min: 1 },
      { label: '전용면적', value: property.exclusiveArea, required: true, min: 1 },
    ]);
>>>>>>> origin/main
  };

  const handleCalculate = () => {
    const errors = validateInputs();
    setValidationErrors(errors);
    if (errors.length > 0) {
      setResult(null);
      return;
    }

    const calculated = calculateLoanSummary(userProfile, property);
    setResult(calculated);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          내 대출 가능액 판정기
        </h1>
        <p className="text-gray-600">
          정부대출과 일반 주담대의 예상 한도, 불가 사유, 체증식 가능성을 빠르게 확인하세요
        </p>
      </header>

      <div className="space-y-6">
        <FinancialInput data={userProfile} onChange={setUserProfile} />
        <HousingInput data={property} onChange={setProperty} />

        <button
          onClick={handleCalculate}
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          대출 가능액 판정하기
        </button>

        {validationErrors.length > 0 && (
          <section className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-700 mb-2">입력값을 확인해주세요</h3>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </section>
        )}

        {result && <ResultCard result={result} />}
      </div>
    </main>
  );
}
