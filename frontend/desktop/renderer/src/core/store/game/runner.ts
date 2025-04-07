import { Game } from "./game";

export class GameRunner {
    readonly game: Game;
    private timePassed: number = 0;
    private lastStepTime: number | null = null;
    private frameRequest: number | null = null;

    constructor(game: Game) {
        this.game = game;
    }

    private stop() {
        if (this.frameRequest !== null) {
            cancelAnimationFrame(this.frameRequest);
            this.frameRequest = null;
        }
        this.lastStepTime = null;
    }

    reset() {
        this.stop();
        this.game.reset();
        this.timePassed = 0;
    }

    private step(time: number) {
        if (this.lastStepTime) {
            this.timePassed += time - this.lastStepTime;
        }
        this.lastStepTime = time;

        this.game.step(this.timePassed);
        if (this.game.isFinished()) {
            this.stop();
        } else {
            this.frameRequest = requestAnimationFrame((time) =>
                this.step(time)
            );
        }
    }

    start() {
        if (this.game.isRunning()) {
            return;
        }

        this.game.start();
        this.frameRequest = requestAnimationFrame((time) => this.step(time));
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
