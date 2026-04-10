'use client';

import { UserProfileInput, MarriageStatus, JobType } from '@/types';

interface Props {
  data: UserProfileInput;
  onChange: (data: UserProfileInput) => void;
}

export default function FinancialInput({ data, onChange }: Props) {
  const update = <K extends keyof UserProfileInput>(key: K, value: UserProfileInput[K]) => {
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
              type="text"
              inputMode="numeric"
              value={data.myIncome}
              onChange={(e) => update('myIncome', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 5000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">배우자 연소득 (만원)</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.spouseIncome}
              onChange={(e) => update('spouseIncome', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 3000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">NICE 점수 (선택)</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.niceScore}
              onChange={(e) => update('niceScore', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 820"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">KCB 점수 (선택)</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.kcbScore}
              onChange={(e) => update('kcbScore', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 760"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">보유 현금 (만원)</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.cash}
              onChange={(e) => update('cash', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 10000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">기존 월 부채 상환액 (만원)</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.existingDebtPayment}
              onChange={(e) => update('existingDebtPayment', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 120"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">나이</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.age}
              onChange={(e) => update('age', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 33"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">자녀 수</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.childrenCount}
              onChange={(e) => update('childrenCount', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 1"
            />
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">배우자 직업 형태</label>
          <select
            value={data.spouseJobType}
            onChange={(e) => update('spouseJobType', e.target.value as JobType)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            disabled={data.marriageStatus === 'single'}
          >
            <option value="employee">직장인</option>
            <option value="selfEmployed">자영업자</option>
            <option value="freelancer">프리랜서 또는 기타</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            본인이 사업자여도 배우자가 직장인이면 배우자 명의 기준으로 체증식을 조건부 검토할 수 있습니다.
          </p>
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
              checked={data.newbornWithin2Years}
              onChange={(e) => update('newbornWithin2Years', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">2년 내 출산</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.wantsGraduatedRepayment}
              onChange={(e) => update('wantsGraduatedRepayment', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">체증식 관심</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.hasExistingFirstHomeLoan}
              onChange={(e) => update('hasExistingFirstHomeLoan', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">기존 생애최초 신혼부부 대출 보유</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.hasUsedFirstTimeLoanBefore}
              onChange={(e) => update('hasUsedFirstTimeLoanBefore', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">과거 생애최초 대출 사용 이력</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.wantsNewbornRefinance}
              onChange={(e) => update('wantsNewbornRefinance', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">신생아 특례로 갈아타기 희망</span>
          </label>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">기존 생애최초 신혼부부 대출 잔액 (만원)</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.existingFirstHomeLoanBalance}
            onChange={(e) => update('existingFirstHomeLoanBalance', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            placeholder="예: 18000"
            disabled={!data.hasExistingFirstHomeLoan}
          />
          <p className="mt-1 text-xs text-gray-500">
            갈아타기 시에는 기존 대출 잔액을 제외한 범위에서만 추가 대출 가능액을 추정합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
