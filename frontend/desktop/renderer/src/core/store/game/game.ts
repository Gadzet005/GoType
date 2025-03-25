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
    private currentTick = 0;

    constructor(level: Level) {
        makeObservable(this, {
            statistics: observable,
            // @ts-expect-error: private observable
            currentTick: observable,
            status: observable,
            field_: observable,

            field: computed,
            tick: computed,

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
        this.currentTick = 0;
        this.status = GameStatus.idle;

        this.events.removeAllEvents();
        this.field_ = new GameField(this.level.sentences, this.level.language);

        this.level.sentences.forEach((sentence) => {
            const introDuration =
                sentence.style.animations.intro?.duration ?? 0;
            const outroDuration =
                sentence.style.animations.outro?.duration ?? 0;

            this.events.addEvent(sentence.showTime, new SentenceIntroEvent());
            this.events.addEvent(
                sentence.showTime + introDuration,
                new SentenceActiveEvent()
            );
            this.events.addEvent(
                sentence.showTime + sentence.duration - outroDuration,
                new SentenceOutroEvent()
            );
            this.events.addEvent(
                sentence.showTime + sentence.duration,
                new SentenceHideEvent()
            );
        });
    }

    step() {
        const events = this.events.getEvents(this.currentTick);
        events?.forEach((event) => {
            event.run(this.field);
        });

        if (this.currentTick === this.level.duration) {
            this.finish();
            return;
        }

        this.currentTick++;
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
        return (this.currentTick / this.level.duration) * 100;
    }

    input(letter: string): void {
        const result = this.field.moveCursor(letter);
        if (result == MoveCursorResult.ignore) {
            return;
        }
        this.statistics.addInputResult(
            letter,
            result == MoveCursorResult.correct
        );
    }

    get tick() {
        return this.currentTick;
    }

    get field() {
        return this.field_;
    }
}
