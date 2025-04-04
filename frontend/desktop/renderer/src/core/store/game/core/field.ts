import { StyledSentenceInfo } from "@desktop-common/level/sentence";
import { Sentence } from "./sentence";
import { FieldSentence } from "./fieldSentence";
import { action, computed, observable, makeObservable } from "mobx";

export class GameField {
    private sentences_!: FieldSentence[];

    constructor(info: StyledSentenceInfo[]) {
        makeObservable(this, {
            // @ts-expect-error: private observables
            sentences_: observable,
            reset: action,
            sentences: computed,
        });

        this.sentences_ = info.map((s, idx) => new FieldSentence(idx, s));
    }

    reset() {
        this.sentences_.forEach((sentence) => sentence.reset());
    }

    getVisibleSentences(time: number): FieldSentence[] {
        return this.sentences_.filter((sentence) => sentence.isVisible(time));
    }

    get sentences(): Sentence[] {
        return this.sentences_;
    }
}
