export function take<T>(iterator: Iterator<T>, count: number): T[] {
    const result: T[] = [];

    for (let i = 0; i < count; i++) {
        const { value, done } = iterator.next();
        result.push(value);
        if (done) break;
    }

    return result;
}

function filter(predicate, object, self) {
    var result = new Map();

    object.forEach(function (value, key, object) {
        if (predicate.call(this, value, key, object)) result.set(key, value);
    }, self);

    return result;
}
