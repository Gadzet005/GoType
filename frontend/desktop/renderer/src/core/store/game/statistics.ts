import { action, observable, makeObservable, computed } from "mobx";
import { GameScore } from "./consts";
import { Language } from "@desktop-common/language";

export class GameStatistics {
    private _score: number = 0;
    private _alphabetTotal: number[];
    private _alphabetRight: number[];
    private readonly language: Language;

    constructor(language: Language) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            _score: observable,
            score: computed,
            reset: action,
            addInputResult: action,
        });

        this.language = language;
        this._alphabetTotal = Array(language.alphabet.length).fill(0);
        this._alphabetRight = Array(language.alphabet.length).fill(0);
    }

    reset() {
        this._score = 0;
        this._alphabetTotal = Array(this.language.alphabet.length).fill(0);
        this._alphabetRight = Array(this.language.alphabet.length).fill(0);
    }

    private addLetterToStatistics(letter: string, isRight: boolean): void {
        const index = this.language.alphabet.indexOf(letter);
        if (index >= 0) {
            this._alphabetTotal[index]++;
            this._alphabetRight[index] += isRight ? 1 : 0;
        }
    }

    get score(): number {
        return this._score;
    }

    get alphabetTotal() {
        return this._alphabetTotal.map((value: number, index: number) => {
            return {
                letter: this.language.alphabet[index],
                total: value,
            };
        });
    }

    get alphabetRatio() {
        return this._alphabetRight.map((value: number, index: number) => {
            const total = this._alphabetTotal[index];
            const ratio = total === 0 ? 1 : value / total;
            return {
                letter: this.language.alphabet[index],
                ratio: ratio * 100,
            };
        });
    }

    get totalLetters(): number {
        return this._alphabetTotal.reduce((a, b) => a + b, 0);
    }

    get rightLetters(): number {
        return this._alphabetRight.reduce((a, b) => a + b, 0);
    }

    // right / total in %
    get accuracy(): number {
        if (this.totalLetters === 0) {
            return 100;
        }
        return (this.rightLetters / this.totalLetters) * 100;
    }

    // Add to statistics that letter was typed
    addInputResult(letter: string, isRight: boolean) {
        if (!this.language.includes(letter)) {
            return;
        }
        this.addLetterToStatistics(letter, isRight);
        if (isRight) {
            this._score += GameScore.letter;
        }
    }
}
