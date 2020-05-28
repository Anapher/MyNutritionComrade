export function createChunks<T>(a: T[], chunkSize: number): T[][] {
    var result = [];
    for (var i = 0; i < a.length; i += chunkSize) result.push(a.slice(i, i + chunkSize));
    return result;
}
