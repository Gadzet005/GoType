import { Game } from "./game";

export class GameRunner {
    readonly game: Game;
    readonly tickTime: number;
    private stepTimeout: NodeJS.Timeout | null = null;
    private timePassed: number = 0;
    private lastStepTime: number | null = null;

    constructor(game: Game, tickTime: number) {
        this.game = game;
        this.tickTime = tickTime;
    }

    private stop() {
        if (this.stepTimeout) {
            clearTimeout(this.stepTimeout);
        }
        this.stepTimeout = null;
        this.lastStepTime = null;
    }

    reset() {
        this.stop();
        this.game.reset();
        this.timePassed = 0;
    }

    private step() {
        const stepStartTime = Date.now();
        if (this.lastStepTime) {
            this.timePassed += stepStartTime - this.lastStepTime;
        }
        this.lastStepTime = stepStartTime;

        this.game.step(this.timePassed);
        if (this.game.isFinished()) {
            this.stop();
        } else {
            const timeout = this.tickTime - Date.now() + stepStartTime;
            this.stepTimeout = setTimeout(() => {
                this.step();
            }, Math.max(0, timeout));
        }
    }

    start() {
        if (this.game.isRunning()) {
            return;
        }

        this.game.start();
        this.step();
    }

    finish() {
        if (this.game.isFinished()) {
            return;
        }

        this.stop();
        this.game.finish();
    }

    pause() {
        if (this.game.isPaused()) {
            return;
        }

        this.stop();
        this.game.pause();
    }
}
