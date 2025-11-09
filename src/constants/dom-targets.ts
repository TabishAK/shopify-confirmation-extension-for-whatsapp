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
    textTransform: 'normalizePlateNumber',
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
    textTransform: 'normalizeProductName',
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
    id: 'customer-phone',
    label: 'Customer phone',
    strategy: 'selector',
    value: CUSTOMER_DETAILS_SELECTOR,
    textTransform: 'normalizePhoneNumber',
  },
];


// Sindh Ajrak New Style (White) Upper Side Embossed Replica Number Plate = Sindh Ajrak New Style (White)
// All Punjab Upper Side Embossed Replica Number Plate = Punjab New Style (Car)
// Islamabad Style Upped Side Embossed Replica Number Plate = Islamabad New Style (Car)
// Punjab Old Style Upper Side Embossed Number Plate = Punjab Green Patti
// Sindh Ajrak Style Yellow Upper Side Embossed Replica Number Plate (Commercial) = Yellow Commercial Ajrak new Style
// Sindh Ajrak Style Replica Upper side Embossed Number Plates (Bike) = Sindh Ajrak new Style (Bike)
// Punjab Style Upper Side Embossed Replica Number Plates (Bike) = Punjab New Style (Bike)
// Premium Quality Sindh Ajrak New Style (White) Upper Side Embossed Replica Number Plate = Sindh Ajrak New Style (White) Premium Quality Charges 3000/-
// Premium Quality Punjab Style (White) Upper Side Embossed Replica Number Plate = Punjab Green Patti Premium Quality Charges 3000/-
// Premium Quality Sindh Ajrak New Style (White) Upper Side Embossed Replica Number Plate For Bike = Sindh Ajrak New Style (Bike) Premium Quality Charges 2000/-