import { requireEqual } from "@/core/utils/panic";
import { action, computed, makeObservable, observable } from "mobx";

export enum LetterState {
    default,
    mistake,
    success,
}

export class Letter {
    readonly char: string;
    private state_: LetterState = LetterState.default;

    constructor(letter: string) {
        requireEqual(letter.length, 1, "invalid letter length");

        makeObservable(this, {
            // @ts-expect-error: private observable
            state_: observable,

            mistake: action,
            success: action,
            reset: action,

            state: computed,
        });

        this.char = letter;
    }

    mistake() {
        this.state_ = LetterState.mistake;
    }

    success() {
        this.state_ = LetterState.success;
    }

    reset() {
        this.state_ = LetterState.default;
    }

    isEqual(c: string): boolean {
        return this.char.toLowerCase() === c.toLowerCase();
    }

    get state() {
        return this.state_;
    }
}
