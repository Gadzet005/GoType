export function round(n: number, k: number = 0) {
    return parseFloat(n.toFixed(k));
}

export function toMilliseconds(seconds: number) {
    return round(seconds * 1000, 2);
}

export function toSeconds(milliseconds: number) {
    return round(milliseconds / 1000, 2);
}
