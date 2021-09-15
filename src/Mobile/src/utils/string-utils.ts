/**
 * Round a number with a specific amount of decimals
 * @param num the number
 * @param decimals the amount of decimals
 */
export function roundNumber(num: number, decimals: number = 1) {
   const pow = Math.pow(10, decimals);
   return Math.round((num + Number.EPSILON) * pow) / pow;
}

/**
 * Format a number to a string with a maximum amount of deciamls. This will not append unnecessary zeros
 * @param num the number
 * @param decimals the maximum amount of deciamls
 */
export function formatNumber(num: number, decimals: number = 1): string {
   return roundNumber(num, decimals).toString();
}
