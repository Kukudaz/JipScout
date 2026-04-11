export const parseNumber = (value: string | number): number => {
  if (value === undefined || value === null) return 0;
  const str = String(value);
  if (str.trim() === '') return 0;
  const cleaned = str.replace(/,/g, '').trim();
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
};

export const formatCurrency = (amount: number): string => {
  if (amount === 0) return '0만원';
  return `${amount.toLocaleString()}만원`;
};

export const formatCurrencyKorean = (amount: number): string => {
  if (amount === 0) return '0만원';
  
  const eok = Math.floor(amount / 10000);
  const chun = amount % 10000;
  
  if (eok > 0 && chun > 0) {
    return `${eok}억 ${chun.toLocaleString()}만원`;
  } else if (eok > 0) {
    return `${eok}억원`;
  } else {
    return `${chun.toLocaleString()}만원`;
  }
};
