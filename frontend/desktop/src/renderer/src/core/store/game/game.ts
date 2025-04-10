import { action, makeObservable, observable, computed } from "mobx";
import { GameStatistics, StatInputResultType } from "./statistics";
import { GameField } from "./core/field";
import { Cursor, InputResult } from "./core/cursor";
import { SentenceData } from "@common/level/sentence";
import { Language } from "@/core/utils/language";
import { requireTrue } from "@/core/utils/panic";
import { LetterState } from "./core/letter";

enum GameStatus {
    idle,
    running,
    paused,
    finished,
}

export interface GameData {
    sentences: SentenceData[];
    language: Language;
    duration: number;
}

export class Game {
    readonly statistics: GameStatistics;
    readonly duration: number;
    readonly language: Language;

    private readonly field: GameField;
    private readonly cursor: Cursor;
    private status = GameStatus.idle;
    private time_ = 0;
    private firstActiveSentence = 0;

    constructor(data: GameData) {
        requireTrue(data.duration > 0, "duration must be greater than 0");

        makeObservable(this, {
            // @ts-expect-error: private observable
            time_: observable,
            status: observable,

            time: computed,

            reset: action,
            start: action,
            step: action,
            pause: action,
            input: action,
            finish: action,
        });

        this.field = new GameField(data.sentences);
        this.cursor = new Cursor(this.field.sentences, data.language);
        this.statistics = new GameStatistics(data.language, data.duration);
        this.duration = data.duration;
        this.language = data.language;
    }

    reset() {
        this.field.reset();
        this.cursor.reset();
        this.statistics.reset();
        this.status = GameStatus.idle;
        this.time_ = 0;
    }

    private updateFirstActiveSentence() {
        while (
            this.firstActiveSentence < this.field.sentences.length &&
            this.field.sentences[this.firstActiveSentence].isComplete(
                this.time_
            )
        ) {
            const sentence = this.field.sentences[this.firstActiveSentence];
            sentence.letters.forEach((letter) => {
                if (letter.state === LetterState.default) {
                    this.statistics.addInputResult({
                        type: StatInputResultType.missed,
                        time: this.time_,
                        letter: letter.char,
                    });
                }
            });
            this.firstActiveSentence++;
        }
    }

    step(time: number) {
        if (!this.isRunning()) {
            return;
        }

        this.time_ = time;
        this.updateFirstActiveSentence();

        if (time >= this.duration) {
            this.finish();
        }
    }

    start() {
        this.status = GameStatus.running;
    }

    finish() {
        this.status = GameStatus.finished;
    }

    pause() {
        this.status = GameStatus.paused;
    }

    isRunning() {
        return this.status === GameStatus.running;
    }

    isPaused() {
        return this.status === GameStatus.paused;
    }

    isFinished() {
        return this.status === GameStatus.finished;
    }

    /** progress from 0 to 1 */
    getProgress() {
        return Math.min(1, this.time_ / this.duration);
    }

    getVisibleSentences() {
        return this.field.getVisibleSentences(this.time);
    }

    getCursorPosition() {
        return this.cursor.getPosition(this.time);
    }

    input(letter: string): void {
        const result = this.cursor.input(this.time_, letter);
        if (result === InputResult.ignore) {
            return;
        }

        this.statistics.addInputResult({
            time: this.time_,
            letter: letter,
            type:
                result === InputResult.correct
                    ? StatInputResultType.correct
                    : StatInputResultType.incorrect,
        });
    }

    /**
     * Returns the time passed since the start of the game,
     * not including time in paused state.
     */
    get time() {
        return this.time_;
    }
}
