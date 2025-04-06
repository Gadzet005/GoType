import { action, makeObservable, observable, computed } from "mobx";
import { GameStatistics } from "./statistics";
import { GameField } from "./core/field";
import { Cursor, InputResult } from "./core/cursor";
import { SentenceData } from "@desktop-common/level/sentence";
import { Language } from "@/core/utils/language";
import { requireTrue } from "@/core/utils/panic";

enum GameStatus {
    idle,
    running,
    paused,
    finished,
}

export interface GameInfo {
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
    private time_: number = 0;

    constructor(info: GameInfo) {
        requireTrue(info.duration > 0, "duration must be greater than 0");

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

        this.field = new GameField(info.sentences);
        this.cursor = new Cursor(this.field.sentences, info.language);
        this.statistics = new GameStatistics(info.language);
        this.duration = info.duration;
        this.language = info.language;
    }

    reset() {
        this.field.reset();
        this.cursor.reset();
        this.statistics.reset();
        this.status = GameStatus.idle;
        this.time_ = 0;
    }

    step(time: number) {
        this.time_ = time;
        if (time >= this.duration) {
            this.finish();
        }
    }

    start() {
        if (this.status !== GameStatus.finished) {
            this.status = GameStatus.running;
        }
    }

    finish() {
        if (this.status !== GameStatus.idle) {
            this.status = GameStatus.finished;
        }
    }

    pause() {
        if (this.status === GameStatus.running) {
            this.status = GameStatus.paused;
        }
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
        this.statistics.addInputResult(letter, result === InputResult.correct);
    }

    /**
     * Returns the time passed since the start of the game,
     * not including time in paused state.
     */
    get time() {
        return this.time_;
    }
}
