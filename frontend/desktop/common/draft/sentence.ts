import { percent, tick } from "../types";

export interface DraftSentence {
    content: string;
    coord: {
        x: percent;
        y: percent;
    };

    showTime?: tick;
    duration?: tick;
    styleClass?: string;
}
