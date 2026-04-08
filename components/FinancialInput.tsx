'use client';

import { FinancialInfo, MarriageStatus, JobType, RegionType } from '@/types';

interface Props {
  data: FinancialInfo;
  onChange: (data: FinancialInfo) => void;
}

export default function FinancialInput({ data, onChange }: Props) {
  const update = <K extends keyof FinancialInfo>(key: K, value: FinancialInfo[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900">재무 정보</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">본인 연소득 (만원)</label>
            <input
              type="number"
              value={data.myIncome}
              onChange={(e) => update('myIncome', Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="5000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">배우자 연소득 (만원)</label>
            <input
              type="number"
              value={data.spouseIncome}
              onChange={(e) => update('spouseIncome', Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">보유 현금 (만원)</label>
            <input
              type="number"
              value={data.cash}
              onChange={(e) => update('cash', Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="10000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">기존 월 부채 상환액 (만원)</label>
            <input
              type="number"
              value={data.existingDebtPayment}
              onChange={(e) => update('existingDebtPayment', Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">나이</label>
            <input
              type="number"
              value={data.age}
              onChange={(e) => update('age', Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">혼인 상태</label>
            <select
              value={data.marriageStatus}
              onChange={(e) => update('marriageStatus', e.target.value as MarriageStatus)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">미혼</option>
              <option value="newlywed">신혼 또는 결혼예정</option>
              <option value="married">기혼</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">직업 형태</label>
            <select
              value={data.jobType}
              onChange={(e) => update('jobType', e.target.value as JobType)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="employee">직장인</option>
              <option value="selfEmployed">자영업자</option>
              <option value="freelancer">프리랜서 또는 기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">지역 구분</label>
            <select
              value={data.regionType}
              onChange={(e) => update('regionType', e.target.value as RegionType)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="seoulMetro">수도권 또는 규제지역</option>
              <option value="nonSeoul">비수도권 또는 비규제지역</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isFirstTimeBuyer}
              onChange={(e) => update('isFirstTimeBuyer', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">생애최초 주택구입</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isHomeless}
              onChange={(e) => update('isHomeless', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">무주택자</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isSteppingInterest}
              onChange={(e) => update('isSteppingInterest', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">체증식 관심</span>
          </label>
        </div>
      </div>
    </section>
  );
}
