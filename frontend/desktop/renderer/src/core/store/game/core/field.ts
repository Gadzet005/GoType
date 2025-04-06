import { StyledSentenceInfo } from "@desktop-common/level/sentence";
import { FieldSentence } from "./fieldSentence";
import { action, observable, makeObservable } from "mobx";

export class GameField {
    readonly sentences: FieldSentence[];

    constructor(info: StyledSentenceInfo[]) {
        makeObservable(this, {
            sentences: observable.shallow,
            reset: action,
        });

        this.sentences = info.map((s, idx) => new FieldSentence(idx, s));
    }

    reset() {
        this.sentences.forEach((sentence) => sentence.reset());
    }

    getVisibleSentences(time: number): FieldSentence[] {
        return this.sentences.filter((sentence) => sentence.isVisible(time));
    }
}
