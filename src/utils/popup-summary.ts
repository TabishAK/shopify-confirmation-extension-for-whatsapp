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

const normalizeValue = (value: string | null): string =>
  value && value.length > 0 ? value : DEFAULT_PLACEHOLDER;

export const buildPopupSummary = (results: DomTextResult[]): string => {
  if (results.length === 0) {
    return '';
  }

  const plateNumber = resolveResultValue(results, 'word-wrap-text');
  const productName = resolveResultValue(results, 'product-name');
  const address = resolveResultValue(results, 'customer-address');
  const phone = resolveResultValue(results, 'customer-phone');
  const customerName = resolveResultValue(results, 'customer-name');
  const npNumber = resolveResultValue(results, 'np-number');

  const sections: string[] = [];

  const headerSection = [plateNumber, productName].map(normalizeValue).join('\n');
  sections.push(headerSection);

  const addressSection = normalizeValue(address);
  sections.push(`\n${addressSection}\n`);

  const footerSection = [phone, customerName, npNumber]
    .map(normalizeValue)
    .join('\n');
  sections.push(footerSection);

  return sections.join('\n').trim();
};

