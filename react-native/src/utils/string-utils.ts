import _ from 'lodash';

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
 * Captialize the first letter of the string, e. g. paris -> Paris
 * @param s string
 */
export function capitalizeFirstLetter(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
}

/**
 * Format a date to yyyy-MM-dd and pad with zeros if necessary
 * @param date the date
 */
export function toDateString(date: Date): string {
    return (
        date.getFullYear() +
        '-' +
        _.padStart((date.getMonth() + 1).toString(), 2, '0') +
        '-' +
        _.padStart(date.getDate().toString(), 2, '0')
    );
}
