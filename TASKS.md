# 현재 리빌드 작업

## 1. 방향 전환
기존 "내 집 가능 예산 계산기" 구조를
"대출 상품 판정기" 구조로 바꾼다.

## 2. 입력 폼 축소 및 재구성
### 제거
- preferredLocation
- minArea
- minRooms
- minBathrooms
- preferredDirection
- entranceDirection
- maxDistanceToStation
- preferredStructure
- maxBuildingAge
- canRenovate
- emergencyFund
- movingCost
- applianceCost
- repairCost
- weddingCost

### 추가
- age
- jobType
- maritalStatus
- newbornWithin2Years
- childrenCount
- homePrice
- exclusiveArea
- isCapitalArea
- isRegulatedArea
- wantsGraduatedRepayment

## 3. 타입 재정의
types/index.ts를 아래 기준으로 다시 정의한다.
- UserProfileInput
- PropertyInput
- LoanProductResult
- FinalLoanSummary

## 4. 정책 룰 분리
lib/policies/loanRules.ts 생성
- newbornSpecial rules
- didimdol rules
- bogeumjari rules
- bankMortgage estimate rules
- repayment rules

## 5. 상품별 판정 함수 분리
아래 파일을 만든다.
- lib/eligibility/newborn.ts
- lib/eligibility/didimdol.ts
- lib/eligibility/bogeumjari.ts
- lib/eligibility/bankMortgage.ts
- lib/eligibility/repayment.ts

각 함수는 아래를 반환한다.
- status
- amount
- reasons[]
- failReasons[]
- notes[]

## 6. 통합 계산 함수 재작성
lib/calculator.ts를 다시 작성한다.
출력:
- finalEstimatedLoanAmount
- newbornSpecial result
- didimdol result
- bogeumjari result
- bankMortgage result
- repayment result
- totalBuyingPower

## 7. 결과 카드 개편
components/ResultCard.tsx를 아래 구조로 바꾼다.
- 상단 요약 카드
- 상품별 상세 카드 4개
- 체증식 카드
- 안내 문구

## 8. 숫자 입력 버그 수정
현재 숫자 입력값이 0으로 고정되어 수정이 불편하다.
수정 원칙:
- input type="number"에 숫자 state 직접 바인딩하지 않는다
- 폼 입력 상태는 string으로 관리한다
- 값이 비어 있을 때 "" 유지
- 계산 직전에 parseNumber()로 숫자 변환
- placeholder만 0 또는 예시값 표시
- 필요 시 inputMode="numeric" 사용

## 9. 첫 화면 문구 교체
변경 전:
- 내 집 가능 예산 계산기
변경 후:
- 내 대출 가능액 판정기

## 10. 완료 조건
- npm run build 통과
- 숫자 입력시 맨 앞 0 고정 문제 없음
- 상품별 가능 여부와 예상액이 구분됨
- 불가 사유가 화면에 표시됨
