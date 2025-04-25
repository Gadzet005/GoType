import { makeObservable, observable } from "mobx";
import { Letter } from "./letter";
import { CoreSentenceData } from "@/core/types/game";

export enum SentenceState {
    initial,
    intro,
    active,
    outro,
    hidden,
}

export class Sentence {
    readonly letters: Letter[];
    readonly showTime: number;
    readonly introDuration: number;
    readonly activeDuration: number;
    readonly outroDuration: number;

    constructor(data: CoreSentenceData) {
        makeObservable(this, {
            letters: observable.shallow,
        });

        this.letters = data.content
            .split("")
            .map((letter: string) => new Letter(letter));
        this.showTime = data.showTime;
        this.introDuration = data.introDuration;
        this.activeDuration = data.activeDuration;
        this.outroDuration = data.outroDuration;
    }

    getState(time: number): SentenceState {
        if (time < this.introTime) {
            return SentenceState.initial;
        } else if (time < this.activeTime) {
            return SentenceState.intro;
        } else if (time < this.outroTime) {
            return SentenceState.active;
        } else if (time < this.hideTime) {
            return SentenceState.outro;
        } else {
            return SentenceState.hidden;
        }
    }

    isVisible(time: number) {
        const state = this.getState(time);
        return (
            state === SentenceState.intro ||
            state === SentenceState.active ||
            state === SentenceState.outro
        );
    }

    isActive(time: number) {
        return this.getState(time) === SentenceState.active;
    }

    isComplete(time: number) {
        const state = this.getState(time);
        return state === SentenceState.outro || state === SentenceState.hidden;
    }

    get length() {
        return this.letters.length;
    }

    get introTime() {
        return this.showTime;
    }

    get activeTime() {
        return this.showTime + this.introDuration;
    }

    get outroTime() {
        return this.showTime + this.introDuration + this.activeDuration;
    }

    get hideTime() {
        return (
            this.showTime +
            this.introDuration +
            this.activeDuration +
            this.outroDuration
        );
    }

    get totalDuration() {
        return this.introDuration + this.activeDuration + this.outroDuration;
    }
}
