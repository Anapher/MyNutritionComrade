export function roundNumber(num: number) {
    return Math.round((num + Number.EPSILON) * 10) / 10;
}
