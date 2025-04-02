import { SentenceStyle } from "@desktop-common/level/style";
import { Sentence } from "./sentence";
import { StyledSentenceInfo } from "@desktop-common/level/sentence";

export class FieldSentence extends Sentence {
    readonly idx: number;
    readonly style: SentenceStyle;

    constructor(idx: number, info: StyledSentenceInfo) {
        super(info);

        this.idx = idx;
        this.style = info.style;
    }

    reset() {
        this.letters.forEach((letter) => letter.reset());
    }
}
