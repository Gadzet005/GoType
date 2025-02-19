import { tick, percent } from "../types";
import { SentenceStyle } from "./style";

export interface Sentence {
    content: string; // words
    showTime: tick; // time for sentence to appear in ticks
    duration: tick; // time for sentence to disappear in ticks

    style: SentenceStyle;

    coord: {
        // (0%, 0%)     = top left corner
        // (100%, 100%) = bottom right corner
        x: percent;
        y: percent;
    };
}
