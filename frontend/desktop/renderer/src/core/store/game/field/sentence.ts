import { Sentence } from "@desktop-common/sentence";
import { action, computed, makeObservable, observable } from "mobx";

export enum LetterState {
    default,
    mistake,
    success,
}

export class SentenceCursor {
    private readonly maxValue: number;
    private _position: number = -1;

    constructor(maxValue: number) {
        this.maxValue = maxValue;

        makeObservable(this, {
            // @ts-expect-error: private observable
            _position: observable,
            move: action,
            position: computed,
            isInited: computed,
            isOnEnd: computed,
        });
    }

    // move cursor forward
    // returns false if cursor is at end of sentence
    move(): boolean {
        this._position++;
        return this._position < this.maxValue;
    }

    get position() {
        return this._position;
    }

    get isInited(): boolean {
        return this._position !== -1;
    }

    get isOnEnd(): boolean {
        return this._position >= this.maxValue;
    }
}

/* 
    eslint-disable 
    @typescript-eslint/no-empty-object-type,
    @typescript-eslint/no-unsafe-declaration-merging
*/
// sentence on game field
export interface GameFieldSentence extends Sentence {}
export class GameFieldSentence implements Sentence {
    readonly id: number;
    readonly cursor: SentenceCursor;
    private state: LetterState[];

    constructor(id: number, sentence: Sentence) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            state: observable,
            cursor: observable,
        });

        this.id = id;
        this.state = Array(sentence.content.length).fill(LetterState.default);
        this.cursor = new SentenceCursor(sentence.content.length);
        Object.assign(this, sentence);
    }

    getLetterStyle(index: number) {
        if (index === this.cursor.position) {
            return {
                ...this.style.letter.default,
                ...this.style.letter.current,
            };
        }

        switch (this.state[index]) {
            case LetterState.mistake:
                return {
                    ...this.style.letter.default,
                    ...this.style.letter.mistake,
                };
            case LetterState.success:
                return {
                    ...this.style.letter.default,
                    ...this.style.letter.success,
                };
            default:
                return this.style.letter.default;
        }
    }

    getLetterState(index: number): LetterState {
        return this.state[index];
    }

    setLetterState(index: number, state: LetterState): void {
        this.state[index] = state;
    }

    get length(): number {
        return this.content.length;
    }

    get cursorLetter(): string {
        return this.content[this.cursor.position];
    }
}

/* eslint-enable */
