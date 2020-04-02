export function roundNumber(num: number, decimals: number = 1) {
    const pow = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * pow) / pow;
}

export function formatNumber(num: number, decimals: number = 1): string {
    return roundNumber(num, decimals).toString();
}

export function capitalizeFirstLetter(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
}
