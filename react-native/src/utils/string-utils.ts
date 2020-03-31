export function roundNumber(num: number) {
    return Math.round((num + Number.EPSILON) * 10) / 10;
}

export function capitalizeFirstLetter(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
}
