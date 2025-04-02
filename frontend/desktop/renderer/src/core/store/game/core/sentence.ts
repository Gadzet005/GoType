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

export class Sentence {
    readonly letters: Letter[];
    readonly showTime: number;
    readonly introDuration: number;
    readonly activeDuration: number;
    readonly outroDuration: number;

    constructor(info: SentenceInfo) {
        makeObservable(this, {
            letters: observable.shallow,
        });

        this.letters = info.content
            .split("")
            .map((letter: string) => new Letter(letter));
        this.showTime = info.showTime;
        this.introDuration = info.introDuration;
        this.activeDuration = info.activeDuration;
        this.outroDuration = info.outroDuration;
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

    isVisible(time: number): boolean {
        const state = this.getState(time);
        return (
            state === SentenceState.intro ||
            state === SentenceState.active ||
            state === SentenceState.outro
        );
    }

    isActive(time: number): boolean {
        return this.getState(time) === SentenceState.active;
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
