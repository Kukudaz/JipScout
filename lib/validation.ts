export interface NumericFieldCheck {
  label: string;
  value: string;
  required?: boolean;
  min?: number;
  max?: number;
}

const NUMERIC_PATTERN = /^-?\d+(?:[.,]\d+)?$/;

export const isNumericString = (value: string): boolean => {
  const trimmed = value.trim();
  if (trimmed === '') return false;
  return NUMERIC_PATTERN.test(trimmed.replace(/,/g, ''));
};

export const toNumber = (value: string): number => Number(value.replace(/,/g, '').trim());

export const validateNumericFields = (fields: NumericFieldCheck[]): string[] => {
  const errors: string[] = [];

  for (const field of fields) {
    const trimmed = field.value.trim();
    const isRequired = field.required ?? false;

    if (!trimmed) {
      if (isRequired) {
        errors.push(`${field.label}을(를) 입력해주세요.`);
      }
      continue;
    }

    if (!isNumericString(trimmed)) {
      errors.push(`${field.label}은(는) 숫자로 입력해주세요.`);
      continue;
    }

    const numericValue = toNumber(trimmed);
    const min = field.min ?? Number.NEGATIVE_INFINITY;
    const max = field.max ?? Number.POSITIVE_INFINITY;

    if (numericValue < min) {
      errors.push(`${field.label}은(는) ${min} 이상이어야 합니다.`);
    }

    if (numericValue > max) {
      errors.push(`${field.label}은(는) ${max} 이하여야 합니다.`);
    }
  }

  return errors;
};
