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

interface LetterStat {
    correct: number;
    incorrect: number;
    missed: number;
}

const initialStat: LetterStat = {
    correct: 0,
    incorrect: 0,
    missed: 0,
};

export class GameStatistics {
    readonly levelDuration: number;
    readonly language: Language;

    private score_: number = 0;
    private alphabetStat_!: LetterStat[];
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
        this.initAlphabetStat();
        this.levelDuration = levelDuration / 60000; // convert to minutes
    }

    reset() {
        this.score_ = 0;
        this.comboCounter_ = 1;
        this.maxCombo_ = 1;
        this.initAlphabetStat();
    }

    private initAlphabetStat() {
        this.alphabetStat_ = Array(this.language.alphabet.length);
        for (let i = 0; i < this.language.alphabet.length; i++) {
            this.alphabetStat_[i] = { ...initialStat };
        }
    }

    get failed() {
        return this.accuracy < Accuracy.minAccuracy;
    }

    get score() {
        return this.score_;
    }

    get alphabetStat() {
        return this.alphabetStat_.map(
            ({ correct, incorrect, missed }, index) => {
                return {
                    letter: this.language.alphabet[index],
                    total: correct + incorrect + missed,
                    mistakes: incorrect + missed,
                };
            }
        );
    }

    get totalLetters() {
        return this.alphabetStat_.reduce(
            (acc, { correct, incorrect, missed }) =>
                acc + correct + incorrect + missed,
            0
        );
    }

    get totalMistakes() {
        return this.alphabetStat_.reduce(
            (acc, { incorrect }) => acc + incorrect,
            0
        );
    }

    get totalCorrect() {
        return this.alphabetStat_.reduce(
            (acc, { correct }) => acc + correct,
            0
        );
    }

    get totalMissed() {
        return this.alphabetStat_.reduce((acc, { missed }) => acc + missed, 0);
    }

    // right / total in %
    get accuracy() {
        if (this.totalLetters === 0) {
            return 100;
        }
        return (this.totalCorrect / this.totalLetters) * 100;
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
        return (this.totalCorrect + this.totalMistakes) / this.levelDuration;
    }

    /** Add to statistics that letter was typed */
    addInputResult(result: StatInputResult) {
        if (!this.language.includes(result.letter)) {
            return;
        }

        const letterIdx = this.language.alphabet.indexOf(
            result.letter.toLowerCase()
        );

        switch (result.type) {
            case StatInputResultType.correct:
                this.alphabetStat_[letterIdx].correct++;
                this.comboCounter_++;
                this.maxCombo_ = Math.max(this.comboCounter_, this.maxCombo_);
                this.score_ += this.comboCounter * Score.letter;
                break;
            case StatInputResultType.incorrect:
                this.alphabetStat_[letterIdx].incorrect++;
                this.comboCounter_ = 1;
                break;
            case StatInputResultType.missed:
                this.alphabetStat_[letterIdx].missed++;
                this.comboCounter_ = 1;
                break;
        }
    }
}
