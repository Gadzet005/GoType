import { TICK_TIME } from "../config/game.config";

export function toTick(value: number) {
    return Math.ceil(value / TICK_TIME);
}

export function toMilliseconds(value: number) {
    return value * TICK_TIME;
}
