import type { DomTarget } from '../types/dom-target';

const CUSTOMER_DETAILS_SELECTOR =
  '.Polaris-Box > div > .Polaris-InlineStack > p';

export const DOM_TARGETS: DomTarget[] = [
  {
    id: 'np-number',
    label: 'NP Number',
    strategy: 'selector',
    value:
      '.Polaris-Text--root.Polaris-Text--headingLg.Polaris-Text--semibold.Polaris-Text--base',
  },
  {
    id: 'word-wrap-text',
    label: 'Plate number',
    strategy: 'class',
    value: '_WordWrap_2u7z6_1',
  },
  {
    id: 'pricing-text',
    label: 'Price',
    strategy: 'selector',
    value:
      '.Polaris-InlineStack .Polaris-Text--root.Polaris-Text--bodyMd.Polaris-Text--regular.Polaris-Text--breakNever.Polaris-Text--base.Polaris-Text--numeric',
    textTransform: 'stripRsPrefix',
  },
  {
    id: 'product-name',
    label: 'Product Name',
    strategy: 'selector',
    value:
      '.Polaris-Link.Polaris-Link--monochrome.Polaris-Link--removeUnderline',
  },

  {
    id: 'customer-name',
    label: 'Customer name',
    strategy: 'selector',
    value: CUSTOMER_DETAILS_SELECTOR,
  },
  {
    id: 'customer-address',
    label: 'Customer address',
    strategy: 'selector',
    value: CUSTOMER_DETAILS_SELECTOR,
  },
  {
    id: 'customer-city',
    label: 'Customer city',
    strategy: 'selector',
    value: CUSTOMER_DETAILS_SELECTOR,
  },
  {
    id: 'customer-country',
    label: 'Customer country',
    strategy: 'selector',
    value: CUSTOMER_DETAILS_SELECTOR,
  },
  {
    id: 'customer-phone',
    label: 'Customer phone',
    strategy: 'selector',
    value: CUSTOMER_DETAILS_SELECTOR,
  },
];
