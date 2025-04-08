export function timeView(time: number | null) {
    if (time === null) {
        return "?";
    }

    const secondsTotal = Math.round(time / 1000);
    const minutes = Math.floor(secondsTotal / 60).toString();
    const seconds = Math.round(Math.floor(secondsTotal % 60))
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
}

export function timeRangeView(start: number | null, duration: number | null) {
    const end = start && duration ? start + duration : null;
    return `${timeView(start)} - ${timeView(end)}`;
}
