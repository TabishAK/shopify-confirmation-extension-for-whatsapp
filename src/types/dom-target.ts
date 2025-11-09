export type DomSelectionStrategy = 'id' | 'class' | 'selector';

export type DomTextTransform =
  | 'stripRsPrefix'
  | 'normalizeProductName'
  | 'normalizePlateNumber'
  | 'normalizePhoneNumber';

export interface LineExtractionOptions {
  startIndex: number;
  endIndex?: number;
  joinWith?: string;
  disallowFirstLine?: boolean;
  disallowLastLine?: boolean;
}

export interface DomTarget {
  id: string;
  label: string;
  strategy: DomSelectionStrategy;
  value: string;
  textTransform?: DomTextTransform;
  lineExtraction?: LineExtractionOptions;
}

export interface DomTextResult {
  id: string;
  label: string;
  textContent: string | null;
}

