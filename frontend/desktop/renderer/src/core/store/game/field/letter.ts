import { requireEqual } from "@/core/utils/panic";
import { LetterStyle, SentenceLetterStyles } from "@desktop-common/level/style";
import { action, computed, makeObservable, observable } from "mobx";

export enum LetterState {
    default,
    mistake,
    success,
}

export class Letter {
    readonly char: string;
    private readonly styles: SentenceLetterStyles;
    private state_: LetterState = LetterState.default;

    constructor(letter: string, styles: SentenceLetterStyles) {
        requireEqual(letter.length, 1, "invalid letter length");

        makeObservable(this, {
            // @ts-expect-error: private observable
            state_: observable,

            mistake: action,
            success: action,

            state: computed,
        });

        this.char = letter;
        this.styles = styles;
    }

    mistake() {
        this.state_ = LetterState.mistake;
    }

    success() {
        this.state_ = LetterState.success;
    }

    isEqual(c: string): boolean {
        return this.char.toLowerCase() === c.toLowerCase();
    }

    getStyle(isActive = false): LetterStyle {
        if (isActive) {
            return { ...this.styles.default, ...this.styles.active };
        }

        switch (this.state_) {
            case LetterState.mistake:
                return {
                    ...this.styles.default,
                    ...this.styles.mistake,
                };
            case LetterState.success:
                return {
                    ...this.styles.default,
                    ...this.styles.success,
                };
            default:
                return this.styles.default;
        }
    }

    get state() {
        return this.state_;
    }
}
