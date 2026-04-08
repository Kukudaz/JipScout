'use client';

import { HousingCondition } from '@/types';

interface Props {
  data: HousingCondition;
  onChange: (data: HousingCondition) => void;
}

export default function HousingInput({ data, onChange }: Props) {
  const update = <K extends keyof HousingCondition>(key: K, value: HousingCondition[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900">희망 주택</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">희망 매매가 (만원)</label>
          <input
            type="number"
            value={data.targetPrice}
            onChange={(e) => update('targetPrice', Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="50000"
          />
        </div>
      </div>
    </section>
  );
}
