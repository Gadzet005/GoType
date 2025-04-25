import { Sentence, SentenceState } from "./sentence";
import { Language } from "@/core/utils/language";
import { action, observable, makeObservable } from "mobx";
import { Letter } from "./letter";

export enum InputResult {
    correct,
    incorrect,
    ignore,
}

export interface CursorPosition {
    sentence: number;
    letter: number;
}

export class Cursor {
    readonly lang: Language;
    private readonly sentences: Sentence[];
    private position: CursorPosition = {
        sentence: 0,
        letter: 0,
    };

    constructor(sentences: Sentence[], lang: Language) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            position: observable,
            input: action,
            reset: action,
            normalize: action,
        });

        this.lang = lang;
        this.sentences = sentences;
    }

    private isValid() {
        return (
            this.position.sentence < this.sentences.length &&
            this.position.letter < this.sentences[this.position.sentence].length
        );
    }

    private isValidAndActive(time: number): boolean {
        return (
            this.isValid() &&
            this.sentences[this.position.sentence].isActive(time)
        );
    }

    private move() {
        this.position.letter++;

        const sentenceLength = this.sentences[this.position.sentence].length;
        if (this.position.letter >= sentenceLength) {
            this.position.sentence++;
            this.position.letter = 0;
        }
    }

    private getCurrentLetter(): Letter | null {
        if (!this.isValid()) {
            return null;
        }
        return this.sentences[this.position.sentence].letters[
            this.position.letter
        ];
    }

    private normalize(time: number) {
        while (this.isValid()) {
            const cur = this.sentences[this.position.sentence];
            const state = cur.getState(time);
            if (
                state === SentenceState.outro ||
                state === SentenceState.hidden
            ) {
                this.position.sentence++;
                this.position.letter = 0;
            } else {
                break;
            }
        }

        while (this.isValid()) {
            const c = this.getCurrentLetter()!;
            if (this.lang.includes(c.char)) {
                break;
            }
            c.success();
            this.move();
        }
    }

    input(time: number, c: string): InputResult {
        if (!this.lang.includes(c) || !this.isValidAndActive(time)) {
            return InputResult.ignore;
        }
        const cur = this.getCurrentLetter()!;
        this.move();

        if (cur.isEqual(c)) {
            cur.success();
            return InputResult.correct;
        } else {
            cur.mistake();
            return InputResult.incorrect;
        }
    }

    getPosition(time: number): CursorPosition | null {
        this.normalize(time);
        if (!this.isValidAndActive(time)) {
            return null;
        }
        return this.position;
    }

    reset() {
        this.position = { sentence: 0, letter: 0 };
    }
}
