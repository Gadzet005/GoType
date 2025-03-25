import { SentenceInfo } from "@desktop-common/level/sentence";
import { makeObservable, observable } from "mobx";
import { Letter } from "./letter";

export enum SentenceState {
    initial,
    intro,
    active,
    outro,
    hidden,
}

/** sentence on game field */
export class Sentence {
    readonly idx: number;
    private readonly letters: Letter[];
    private readonly info: SentenceInfo;
    state: SentenceState = SentenceState.initial;

    constructor(idx: number, info: SentenceInfo) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            letters: observable.shallow,
            state: observable,
        });

        this.idx = idx;
        this.info = info;
        this.letters = this.info.content
            .split("")
            .map((letter: string) => new Letter(letter, info.style.letter));
    }

    getLetters() {
        return this.letters;
    }

    getLetter(idx: number) {
        return this.letters[idx];
    }

    isVisible(): boolean {
        return (
            this.state != SentenceState.hidden &&
            this.state != SentenceState.initial
        );
    }

    get introDuration() {
        return this.info.style.animations.intro.duration;
    }

    get outroDuration() {
        return this.info.style.animations.outro.duration;
    }

    get activeDuration() {
        return this.info.duration - this.introDuration - this.outroDuration;
    }

    get activeStart() {
        return this.info.showTime + this.introDuration;
    }

    get showTime() {
        return this.info.showTime;
    }

    get duration() {
        return this.info.duration;
    }

    get style() {
        return this.info.style;
    }

    get coord() {
        return this.info.coord;
    }

    get length() {
        return this.letters.length;
    }
}
