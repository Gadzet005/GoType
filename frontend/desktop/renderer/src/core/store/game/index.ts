import { Level } from "@desktop-common/level";
import { tick } from "@desktop-common/types";
import { action, computed, makeObservable, observable } from "mobx";
import { TICK_TIME } from "./consts";
import { GameState } from "./state";
import { GameStatistics } from "./statistics";
import { GameLevel } from "./level";

enum GameStatus {
    idle,
    running,
    paused,
    finished,
}

export class Game {
    readonly state;
    readonly statistics;
    readonly level: GameLevel;

    private status = GameStatus.idle;
    private tickInterval: NodeJS.Timeout | null = null;
    private currentTick: tick = 0;

    constructor(level: Level) {
        makeObservable(this, {
            state: observable,
            statistics: observable,
            // @ts-expect-error: private observable
            currentTick: observable,
            status: observable,

            progress: computed,
            isFinished: computed,
            isPaused: computed,
            isRunning: computed,

            init: action,
            start: action,
            tick: action,
            pause: action,
            input: action,
        });

        this.level = new GameLevel(level);
        this.state = new GameState(this.level.language);
        this.statistics = new GameStatistics(this.level.language);
        this.init();
    }

    // set initial game state
    init() {
        this.state.init(this.level.game.sentences);
        this.statistics.reset();
        this.currentTick = 0;
        this.status = GameStatus.idle;
        this.tickInterval = null;
    }

    private tick() {
        if (this.currentTick === this.level.durationInTicks) {
            this.finish();
            return;
        }

        const events = this.state.events.getEvents(this.currentTick);
        events?.forEach((event) => {
            event.run(this.state);
        });
        this.currentTick++;
    }

    start() {
        if (this.isRunning) return;
        this.status = GameStatus.running;

        this.tickInterval = setInterval(() => {
            this.tick();
        }, TICK_TIME);
    }

    // stop ticks
    private stop() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
        }
        this.tickInterval = null;
    }

    finish() {
        this.status = GameStatus.finished;
        this.state.field.removeAllSentences();
        this.stop();
    }

    pause() {
        this.status = GameStatus.paused;
        this.stop();
    }

    get isRunning() {
        return this.status === GameStatus.running;
    }

    get isPaused() {
        return this.status === GameStatus.paused;
    }

    get isFinished() {
        return this.status === GameStatus.finished;
    }

    // progress in percent
    get progress() {
        if (this.level.durationInTicks === 0) {
            return 100;
        }
        return (this.currentTick / this.level.durationInTicks) * 100;
    }

    input(letter: string): void {
        const result = this.state.field.cursor.move(letter);
        if (!result) {
            return;
        }

        this.statistics.addInputResult(letter, result.isRight);
    }
}
