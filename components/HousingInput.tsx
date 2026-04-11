'use client';

import { PropertyInput } from '@/types';

interface Props {
  data: PropertyInput;
  onChange: (data: PropertyInput) => void;
}

export default function HousingInput({ data, onChange }: Props) {
  const update = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">희망 주택</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">희망 매매가 (만원)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.homePrice}
            onChange={(e) => update('homePrice', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="예: 50000"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">KB시세 (만원)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.kbPrice}
            onChange={(e) => update('kbPrice', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="예: 48000"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">전용면적 (㎡)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.exclusiveArea}
            onChange={(e) => update('exclusiveArea', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="예: 84"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.isCapitalArea}
            onChange={(e) => update('isCapitalArea', e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">수도권 (서울/경기/인천)</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.isRegulatedArea}
            onChange={(e) => update('isRegulatedArea', e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">규제지역 (강남 3구, 용산)</span>
        </label>
      </div>
    </section>
  );
}
