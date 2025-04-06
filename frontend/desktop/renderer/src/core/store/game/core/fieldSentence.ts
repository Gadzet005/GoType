import { SentenceStyle } from "@desktop-common/level/style";
import { Sentence } from "./sentence";
import { SentenceData } from "@desktop-common/level/sentence";

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
}
