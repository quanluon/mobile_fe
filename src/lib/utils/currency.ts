import { CURRENCY } from '../constants';

/**
 * Format a number as Vietnamese Dong (VND) currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    locale?: string;
  } = {}
): string => {
  const {
    showSymbol = true,
    showCode = false,
    locale = CURRENCY.LOCALE,
  } = options;

  // Format the number with Vietnamese locale
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(amount);

  // Add currency symbol or code
  if (showSymbol) {
    return `${formattedNumber} ${CURRENCY.SYMBOL}`;
  }
  
  if (showCode) {
    return `${formattedNumber} ${CURRENCY.CODE}`;
  }

  return formattedNumber;
};

/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse
 * @returns The parsed number
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove currency symbols and codes
  const cleanString = currencyString
    .replace(new RegExp(`[${CURRENCY.SYMBOL}\\s]`, 'g'), '')
    .replace(CURRENCY.CODE, '')
    .trim();

  // Parse as number
  const parsed = parseFloat(cleanString.replace(/\./g, '').replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get currency configuration
 */
export const getCurrencyConfig = () => CURRENCY;
