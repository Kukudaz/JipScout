'use client';

import { useState } from 'react';
import { FinancialInfo, HousingCondition, CalculationResult } from '@/types';
import { calculateResults } from '@/lib/calculator';
import FinancialInput from '@/components/FinancialInput';
import HousingInput from '@/components/HousingInput';
import ResultCard from '@/components/ResultCard';

const defaultFinancial: FinancialInfo = {
  myIncome: 5000,
  spouseIncome: 0,
  cash: 10000,
  existingDebtPayment: 0,
  isFirstTimeBuyer: true,
  isHomeless: true,
  marriageStatus: 'single',
  jobType: 'employee',
  age: 30,
  regionType: 'seoulMetro',
  isSteppingInterest: false,
};

const defaultHousing: HousingCondition = {
  targetPrice: 50000,
};

export default function Home() {
  const [financial, setFinancial] = useState<FinancialInfo>(defaultFinancial);
  const [housing, setHousing] = useState<HousingCondition>(defaultHousing);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const calculated = calculateResults(financial, housing);
    setResult(calculated);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          내 대출 가능액 빠른 판정기
        </h1>
        <p className="text-gray-600">
          소득과 조건으로 정부대출, 일반 대출의 예상 가능 금액을 확인하세요
        </p>
      </header>

      <div className="space-y-6">
        <FinancialInput data={financial} onChange={setFinancial} />
        <HousingInput data={housing} onChange={setHousing} />

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
