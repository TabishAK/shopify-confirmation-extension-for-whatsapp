const stripNonDialableCharacters = (value: string): string =>
  value.replace(/[^\d+]/g, '');

const normalizeLeadingSymbols = (value: string): string => {
  if (value.startsWith('+')) {
    return value.slice(1);
  }

  if (value.startsWith('00')) {
    return value.slice(2);
  }

  return value;
};

export const buildWhatsappUrl = (phoneNumber: string, message: string): string | null => {
  const cleanedNumber = stripNonDialableCharacters(phoneNumber);
  const normalizedNumber = normalizeLeadingSymbols(cleanedNumber);

  if (normalizedNumber.length < 6) {
    return null;
  }

  const encodedMessage = encodeURIComponent(message.trim());

  return `whatsapp://send?phone=${normalizedNumber}${
    encodedMessage.length > 0 ? `&text=${encodedMessage}` : ''
  }`;
};

