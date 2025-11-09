import { MESSAGE_TYPES } from '@constants/messaging';
import { PRODUCT_NAME_MAPPINGS } from '@constants/product-name-mapping';
import { normalizePlateNumber } from '@utils/plate-number';
import { normalizePhoneNumber } from '@utils/phone-number';
import type { DomTarget, DomTextResult } from '../types/dom-target';
import type { DomTextRequestMessage } from '../types/messages';
import { createLogger } from '@utils/logger';

const logger = createLogger('content');

logger.info('Content script loaded for', window.location.href);

const extractById = (value: string): Element | null => document.getElementById(value);

const extractByClass = (value: string): Element | null => document.querySelector(`.${value}`);

const extractBySelector = (value: string): Element | null => document.querySelector(value);

const resolveElement = (target: DomTarget): Element | null => {
  switch (target.strategy) {
    case 'id':
      return extractById(target.value);
    case 'class':
      return extractByClass(target.value);
    case 'selector':
      return extractBySelector(target.value);
    default:
      return null;
  }
};

const CUSTOMER_DETAIL_TARGET_IDS = new Set<string>(['customer-name', 'customer-address', 'customer-phone']);

const escapeForRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeAddressSegments = (value: string): string =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join(', ');

const removeLocationFragment = (address: string, fragment: string | null): string => {
  if (!fragment) {
    return address;
  }

  const pattern = new RegExp(`\\b${escapeForRegExp(fragment)}\\b`, 'gi');
  const withoutFragment = address.replace(pattern, ' ');

  return sanitizeAddressSegments(withoutFragment);
};

const appendLocationFragments = (
  address: string,
  fragments: Array<string | null>
): string => {
  const baseSegments = address.length > 0 ? address.split(', ') : [];

  const addSegmentIfMissing = (segment: string): void => {
    if (
      !baseSegments.some(
        (existing) => existing.localeCompare(segment, undefined, { sensitivity: 'accent' }) === 0
      )
    ) {
      baseSegments.push(segment);
    }
  };

  fragments
    .map((fragment) => fragment?.trim())
    .filter((fragment): fragment is string => Boolean(fragment && fragment.length > 0))
    .forEach((fragment) => {
      if (!new RegExp(`\\b${escapeForRegExp(fragment)}\\b`, 'i').test(address)) {
        addSegmentIfMissing(fragment);
      }
    });

  return baseSegments.join(', ');
};

const replaceBreaksWithNewlines = (element: Element): void => {
  const breakNodes = element.querySelectorAll('br');
  breakNodes.forEach((breakNode) => {
    breakNode.replaceWith(document.createTextNode('\n'));
  });
};

const extractElementText = (element: Element | null): string | null => {
  if (!element) {
    return null;
  }

  const clone = element.cloneNode(true) as Element;
  replaceBreaksWithNewlines(clone);

  return clone.textContent;
};

const sanitizeText = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  return value
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n?/g, '\n');
};

const splitIntoLines = (value: string | null): string[] =>
  !value
    ? []
    : value
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

const extractLineSelection = (
  rawValue: string | null,
  lines: string[],
  options?: DomTarget['lineExtraction']
): string | null => {
  if (!rawValue) {
    return null;
  }

  if (lines.length === 0) {
    const trimmedValue = rawValue.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  }

  if (!options) {
    const trimmedValue = rawValue.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  }

  const { startIndex, endIndex = startIndex, joinWith = ' ' } = options;

  const normalizeIndex = (index: number, length: number): number | null => {
    if (length === 0) {
      return null;
    }

    if (index >= 0) {
      return index < length ? index : null;
    }

    const fromEnd = length + index;
    return fromEnd >= 0 && fromEnd < length ? fromEnd : null;
  };

  const normalizedStart = normalizeIndex(startIndex, lines.length);
  const normalizedEnd = normalizeIndex(endIndex, lines.length);

  if (normalizedStart === null || normalizedEnd === null) {
    return null;
  }

  const lowerBound = Math.min(normalizedStart, normalizedEnd);
  const upperBound = Math.max(normalizedStart, normalizedEnd);

  if (options.disallowFirstLine && lowerBound === 0) {
    return null;
  }

  if (options.disallowLastLine && upperBound === lines.length - 1) {
    return null;
  }

  const selectedLines = lines.slice(lowerBound, upperBound + 1);
  const combined = selectedLines.join(joinWith).trim();

  return combined.length > 0 ? combined : null;
};

const deriveCustomerDetailValue = (targetId: string, lines: string[]): string | null => {
  if (lines.length === 0) {
    return null;
  }

  const name = lines[0] ?? null;
  const phone = lines.length >= 2 ? lines[lines.length - 1] ?? null : null;

  const middle = lines.slice(1, lines.length >= 2 ? lines.length - 1 : lines.length);
  const [addressLine, cityLine, countryLine, ...additionalAddressParts] = middle;

  const addressParts = [addressLine, ...additionalAddressParts].filter(
    (part): part is string => typeof part === 'string' && part.length > 0
  );

  const address = addressParts.length > 0 ? addressParts.join(', ') : null;
  const city = cityLine ?? null;
  const country = countryLine ?? null;

  switch (targetId) {
    case 'customer-name':
      return name;
    case 'customer-address':
      if (!address && !city && !country) {
        return null;
      }

      const baseAddress = address ?? '';
      const withoutCity = removeLocationFragment(baseAddress, city);
      const withoutCountry = removeLocationFragment(withoutCity, country);
      const sanitizedAddress = sanitizeAddressSegments(withoutCountry);

      return appendLocationFragments(sanitizedAddress, [city, country]);
    case 'customer-phone':
      return phone;
    default:
      return null;
  }
};

const applyTextTransform = (value: string | null, transform?: DomTarget['textTransform']): string | null => {
  if (!value || !transform) {
    return value;
  }

  switch (transform) {
    case 'stripRsPrefix':
      return value.replace(/^Rs\s*/i, '');
    case 'normalizeProductName': {
      const trimmedValue = value.trim();
      return PRODUCT_NAME_MAPPINGS[trimmedValue] ?? trimmedValue;
    }
    case 'normalizePlateNumber':
      return normalizePlateNumber(value);
    case 'normalizePhoneNumber':
      return normalizePhoneNumber(value);
    default:
      return value;
  }
};

const extractTargetTextContent = (target: DomTarget): DomTextResult => {
  const element = resolveElement(target);
  const elementText = extractElementText(element);
  const rawText = sanitizeText(elementText);
  const lines = splitIntoLines(rawText);

  const selectedText = CUSTOMER_DETAIL_TARGET_IDS.has(target.id)
    ? deriveCustomerDetailValue(target.id, lines)
    : extractLineSelection(rawText, lines, target.lineExtraction);

  const textContent = applyTextTransform(selectedText, target.textTransform);

  if (textContent) {
    logger.info(`Extracted text for target "${target.id}"`, textContent);
  } else {
    logger.warn(`No text found for target "${target.id}"`);
  }

  return {
    id: target.id,
    label: target.label,
    textContent
  };
};

const isDomTextRequestMessage = (message: unknown): message is DomTextRequestMessage => {
  if (!message || typeof message !== 'object') {
    return false;
  }

  const candidate = message as Partial<DomTextRequestMessage>;

  return candidate.type === MESSAGE_TYPES.requestDomText && Array.isArray(candidate.targets);
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isDomTextRequestMessage(message)) {
    return;
  }

  const results = message.targets.map(extractTargetTextContent);

  sendResponse({
    type: MESSAGE_TYPES.respondDomText,
    results
  });

  return false;
});

