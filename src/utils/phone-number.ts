const removeNonDialableCharacters = (value: string): string => value.replace(/[^\d+]/g, '');

const deriveLocalNumber = (numericValue: string): string => {
  if (numericValue.startsWith('92')) {
    return `0${numericValue.slice(2)}`;
  }

  if (numericValue.startsWith('0092')) {
    return `0${numericValue.slice(4)}`;
  }

  if (numericValue.startsWith('0')) {
    return numericValue;
  }

  return `0${numericValue}`;
};

export const normalizePhoneNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const numericValue = removeNonDialableCharacters(trimmed).replace(/^\+/, '');

  if (numericValue.length === 0) {
    return null;
  }

  return deriveLocalNumber(numericValue);
};

