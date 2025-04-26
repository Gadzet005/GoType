import { action, observable, makeObservable, computed } from "mobx";
import { Accuracy, Score } from "@/core/config/game.config";
import { Language } from "@/core/utils/language";

export enum StatInputResultType {
    correct,
    incorrect,
    missed,
}

export interface StatInputResult {
    type: StatInputResultType;
    time: number;
    letter: string;
}

export class GameStatistics {
    readonly levelDuration: number;
    readonly language: Language;

    private score_: number = 0;
    private missedTotal_: number = 0;
    private alphabetTotal_: number[];
    private alphabetMistakes_: number[];
    private comboCounter_ = 1;
    private maxCombo_ = 1;

    constructor(language: Language, levelDuration: number) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            score_: observable,
            comboCounter_: observable,

            score: computed,
            comboCounter: computed,
            failed: computed,

            reset: action,
            addInputResult: action,
        });

        this.language = language;
        this.alphabetTotal_ = Array(language.alphabet.length).fill(0);
        this.alphabetMistakes_ = Array(language.alphabet.length).fill(0);
        this.levelDuration = levelDuration / 60000; // convert to minutes
    }

    reset() {
        this.score_ = 0;
        this.alphabetTotal_ = Array(this.language.alphabet.length).fill(0);
        this.alphabetMistakes_ = Array(this.language.alphabet.length).fill(0);
        this.comboCounter_ = 1;
        this.maxCombo_ = 1;
    }

    get failed() {
        return this.accuracy < Accuracy.minAccuracy;
    }

    get score() {
        return this.score_;
    }

    get alphabetStat() {
        return this.alphabetTotal_.map((value: number, index: number) => {
            return {
                letter: this.language.alphabet[index],
                total: value,
                mistakes: this.alphabetMistakes_[index],
            };
        });
    }

    get totalLetters() {
        return this.alphabetTotal_.reduce((a, b) => a + b, 0);
    }

    get totalMistakes() {
        return this.alphabetMistakes_.reduce((a, b) => a + b, 0);
    }

    // right / total in %
    get accuracy() {
        if (this.totalLetters === 0) {
            return 100;
        }
        const ratio =
            (this.totalMistakes + this.missedTotal) / this.totalLetters;
        return (1 - ratio) * 100;
    }

    get accuracyLevel() {
        if (this.failed) {
            return "?";
        }

        const accuracy = this.accuracy;
        for (let i = 1; i < Accuracy.thresholds.length; i++) {
            if (accuracy < Accuracy.thresholds[i]) {
                return Accuracy.names[i - 1];
            }
        }

        // should be unreachable
        return "?";
    }

    get comboCounter() {
        return this.comboCounter_;
    }

    get maxCombo() {
        return this.maxCombo_;
    }

    get avgVelocity() {
        if (this.totalLetters === 0) {
            return 0;
        }
        return (this.totalLetters - this.missedTotal) / this.levelDuration;
    }

    get missedTotal() {
        return this.missedTotal_;
    }

    /** Add to statistics that letter was typed */
    addInputResult(result: StatInputResult) {
        if (!this.language.includes(result.letter)) {
            return;
        }

        const letterIdx = this.language.alphabet.indexOf(
            result.letter.toLowerCase()
        );
        this.alphabetTotal_[letterIdx]++;

        switch (result.type) {
            case StatInputResultType.correct:
                this.comboCounter_++;
                this.maxCombo_ = Math.max(this.comboCounter_, this.maxCombo_);
                this.score_ += this.comboCounter * Score.letter;
                break;
            case StatInputResultType.incorrect:
                this.alphabetMistakes_[letterIdx]++;
                this.comboCounter_ = 1;
                break;
            case StatInputResultType.missed:
                this.comboCounter_ = 1;
                this.missedTotal_++;
                break;
        }
    }
}
