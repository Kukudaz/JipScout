'use client';

import { useState } from 'react';
import { UserProfileInput, PropertyInput, FinalLoanSummary } from '@/types';
import { calculateLoanSummary } from '@/lib/calculator';
import FinancialInput from '@/components/FinancialInput';
import HousingInput from '@/components/HousingInput';
import ResultCard from '@/components/ResultCard';
import { parseNumber } from '@/lib/format';

const defaultUserProfile: UserProfileInput = {
  myIncome: '',
  spouseIncome: '',
  cash: '',
  existingDebtPayment: '',
  age: '',
  jobType: 'employee',
  marriageStatus: 'single',
  isFirstTimeBuyer: false,
  isHomeless: true,
  newbornWithin2Years: false,
  childrenCount: '',
  wantsGraduatedRepayment: false,
};

const defaultProperty: PropertyInput = {
  homePrice: '',
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
    const errors: string[] = [];

    const requiredNumericInputs: Array<{ label: string; value: string }> = [
      { label: '본인 연소득', value: userProfile.myIncome },
      { label: '배우자 연소득', value: userProfile.spouseIncome },
      { label: '보유 현금', value: userProfile.cash },
      { label: '기존 월 부채 상환액', value: userProfile.existingDebtPayment },
      { label: '나이', value: userProfile.age },
      { label: '자녀 수', value: userProfile.childrenCount },
      { label: '희망 매매가', value: property.homePrice },
      { label: '전용면적', value: property.exclusiveArea },
    ];

    for (const item of requiredNumericInputs) {
      if (item.value.trim() === '') {
        errors.push(`${item.label}을(를) 입력해주세요.`);
        continue;
      }

      const parsed = parseNumber(item.value);
      if (parsed < 0) {
        errors.push(`${item.label}은(는) 0 이상이어야 합니다.`);
      }
    }

    if (parseNumber(userProfile.age) > 120) {
      errors.push('나이는 120세 이하로 입력해주세요.');
    }

    return errors;
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
              {validationErrors.slice(0, 5).map((error, index) => (
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
