'use client';

import { useState } from 'react';
import { UserProfileInput, PropertyInput, FinalLoanSummary } from '@/types';
import { calculateLoanSummary } from '@/lib/calculator';
import FinancialInput from '@/components/FinancialInput';
import HousingInput from '@/components/HousingInput';
import ResultCard from '@/components/ResultCard';

const defaultUserProfile: UserProfileInput = {
  myIncome: '5000',
  spouseIncome: '0',
  cash: '10000',
  existingDebtPayment: '0',
  age: '30',
  jobType: 'employee',
  marriageStatus: 'single',
  isFirstTimeBuyer: true,
  isHomeless: true,
  newbornWithin2Years: false,
  childrenCount: '0',
  wantsGraduatedRepayment: false,
};

const defaultProperty: PropertyInput = {
  homePrice: '50000',
  exclusiveArea: '85',
  isCapitalArea: true,
  isRegulatedArea: true,
};

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfileInput>(defaultUserProfile);
  const [property, setProperty] = useState<PropertyInput>(defaultProperty);
  const [result, setResult] = useState<FinalLoanSummary | null>(null);

  const handleCalculate = () => {
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
          소득과 조건으로 정부대출, 일반 대출의 예상 가능 금액을 확인하세요
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

        {result && <ResultCard result={result} />}
      </div>
    </main>
  );
}
