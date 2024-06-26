export const CURRENCY_TO_COUNTRY: { [currency: string]: string } = {
  VND: 'vi-VN',
  USD: 'en-US',
};
// format number to currency
export const formatCurrency = (
  number = 0,
  currency = 'VND',
  // eslint-disable-next-line unused-imports/no-unused-vars
  locale?: string
) => {
  return new Intl.NumberFormat(CURRENCY_TO_COUNTRY[currency], {
    style: 'currency',
    currency,
  }).format(number);
};
