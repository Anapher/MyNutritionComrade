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

/**
 * Compute a hash number for the given string
 * @param s the input value
 * @returns the computed hash value
 */
export function computeHashCode(s: string): number {
   let hash = 0;
   if (s.length == 0) {
      return hash;
   }
   for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
   }
   return hash;
}

/**
 * Captialize the first letter of the string, e. g. paris -> Paris
 * @param s string
 */
export function capitalizeFirstLetter(s: string): string {
   if (s.length === 0) return s;
   return s[0].toUpperCase() + s.slice(1);
}
