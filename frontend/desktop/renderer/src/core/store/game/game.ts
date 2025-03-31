import { action, makeObservable, observable, computed } from "mobx";
import { GameStatistics } from "./statistics";
import { Level } from "./level";
import { GameField, MoveCursorResult } from "./field";
import { EventStorage } from "./events/storage";
import {
    SentenceActiveEvent,
    SentenceHideEvent,
    SentenceIntroEvent,
    SentenceOutroEvent,
} from "./events/sentenceEvents";

enum GameStatus {
    idle,
    running,
    paused,
    finished,
}

export class Game {
    readonly events = new EventStorage();
    readonly statistics: GameStatistics;
    readonly level: Level;

    private field_: GameField;
    private status = GameStatus.idle;
    private time_: number = 0;

    constructor(level: Level) {
        makeObservable(this, {
            statistics: observable,
            // @ts-expect-error: private observable
            time_: observable,
            field_: observable,
            status: observable,

            field: computed,
            time: computed,

            init: action,
            start: action,
            step: action,
            pause: action,
            input: action,
            finish: action,
        });

        this.level = level;
        this.field_ = new GameField(this.level.sentences, this.level.language);
        this.statistics = new GameStatistics(this.level.language);
        this.init();
    }

    /** set initial game state */
    init() {
        this.statistics.reset();
        this.time_ = 0;
        this.status = GameStatus.idle;

        this.events.clear();
        this.field_ = new GameField(this.level.sentences, this.level.language);

        this.field_.sentences.forEach((sentence) => {
            this.events.addEvent(sentence.introTime, new SentenceIntroEvent());
            this.events.addEvent(
                sentence.activeTime,
                new SentenceActiveEvent()
            );
            this.events.addEvent(sentence.outroTime, new SentenceOutroEvent());
            this.events.addEvent(sentence.hideTime, new SentenceHideEvent());
        });
    }

    step(time: number) {
        this.time_ = time;

        const events = this.events.getEventsBefore(time);
        events?.forEach((event) => {
            event.run(this.field);
        });

        if (time >= this.level.duration) {
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

    /** progress in percent */
    getProgress() {
        if (this.level.duration === 0) {
            return 100;
        }
        return Math.min(1, this.time_ / this.level.duration) * 100;
    }

    input(letter: string): void {
        const result = this.field.moveCursor(letter);
        if (result === MoveCursorResult.ignore) {
            return;
        }
        this.statistics.addInputResult(
            letter,
            result === MoveCursorResult.correct
        );
    }

    /**
     * Returns the time passed since the start of the game,
     * not including time in paused state.
     */
    get time() {
        return this.time_;
    }

    get field() {
        return this.field_;
    }
}
