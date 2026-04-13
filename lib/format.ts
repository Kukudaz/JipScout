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

export function formatManwonToKoreanPreview(value: number): string {
  const safe = Math.max(0, Math.floor(value || 0));
  const eok = Math.floor(safe / 10000);
  const manwon = safe % 10000;

  if (safe < 10000) return `${safe.toLocaleString()}만원`;
  return `${eok.toLocaleString()}억 ${manwon.toLocaleString()}만원`;
}

export function formatManwonRaw(value: number): string {
  const safe = Math.max(0, Math.floor(value || 0));
  return `${safe.toLocaleString()}만원`;
}

export function sqmToPyeong(value: number): number {
  return Number((value / 3.305785).toFixed(1));
}

export function formatAreaPreview(value: number): { sqm: string; pyeong: string } {
  const safe = Math.max(0, Number(value || 0));
  return {
    sqm: `${safe}㎡`,
    pyeong: `약 ${sqmToPyeong(safe)}평`,
  };
}
