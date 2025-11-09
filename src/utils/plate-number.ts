const LETTER_NUMBER_PATTERN = /^([a-zA-Z]+)(\d+)$/;

const insertSpaceBetweenLetterAndNumber = (value: string): string | null => {
  const sanitized = value.replace(/[\s-]+/g, '');

  if (sanitized.length === 0) {
    return null;
  }

  const digitStartIndex = sanitized.search(/\d/);

  if (digitStartIndex <= 0) {
    return sanitized.toUpperCase();
  }

  const letterPart = sanitized.slice(0, digitStartIndex).toUpperCase();
  const numberPart = sanitized.slice(digitStartIndex);

  if (!LETTER_NUMBER_PATTERN.test(`${letterPart}${numberPart}`)) {
    return `${letterPart} ${numberPart}`.trim();
  }

  return `${letterPart} ${numberPart}`;
};

export const normalizePlateNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  return insertSpaceBetweenLetterAndNumber(trimmed);
};

