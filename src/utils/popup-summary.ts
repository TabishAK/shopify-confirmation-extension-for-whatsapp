import type { DomTextResult } from '../types/dom-target';

const DEFAULT_PLACEHOLDER = 'Not found';

export const resolveResultValue = (
  results: DomTextResult[],
  id: string
): string | null => {
  const match = results.find((result) => result.id === id);
  if (!match) {
    return null;
  }

  const value = match.textContent?.trim();

  return value && value.length > 0 ? value : null;
};

const buildCityCountryLine = (results: DomTextResult[]): string | null => {
  const city = resolveResultValue(results, 'customer-city');
  const country = resolveResultValue(results, 'customer-country');

  if (city && country) {
    return `${city}, ${country}`;
  }

  return city ?? country ?? null;
};

const normalizeValue = (value: string | null): string =>
  value && value.length > 0 ? value : DEFAULT_PLACEHOLDER;

export const buildPopupSummary = (results: DomTextResult[]): string => {
  if (results.length === 0) {
    return '';
  }

  const orderedValues: Array<string | null> = [
    resolveResultValue(results, 'word-wrap-text'),
    resolveResultValue(results, 'product-name'),
    resolveResultValue(results, 'customer-address'),
    resolveResultValue(results, 'customer-phone'),
    buildCityCountryLine(results),
    resolveResultValue(results, 'customer-name'),
    resolveResultValue(results, 'np-number')
  ];

  return orderedValues.map(normalizeValue).join('\n').trim();
};

