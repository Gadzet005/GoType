import { SentenceStyle } from "@desktop-common/level/style";
import { Sentence } from "./sentence";
import { SentenceData } from "@desktop-common/level/sentence";
import { CursorPosition } from "./cursor";

export class FieldSentence extends Sentence {
    readonly idx: number;
    readonly style: SentenceStyle;

    constructor(idx: number, data: SentenceData) {
        super(data);

        this.idx = idx;
        this.style = data.style;
    }

    reset() {
        this.letters.forEach((letter) => letter.reset());
    }

    getRelativeTime(time: number): number {
        return Math.min(this.totalDuration, Math.max(0, time - this.introTime));
    }

    getRelativeCursor(cursor: CursorPosition | null): number | null {
        return cursor && cursor.sentence == this.idx ? cursor.letter : null;
    }
}
