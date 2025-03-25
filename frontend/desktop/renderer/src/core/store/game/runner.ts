import { TICK_TIME } from "@/core/config/game.config";
import { Game } from "./game";

export class GameRunner {
    private stepInterval: NodeJS.Timeout | null = null;
    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    private stop() {
        if (this.stepInterval) {
            clearInterval(this.stepInterval);
        }
        this.stepInterval = null;
    }

    init() {
        this.stop();
        this.game.init();
    }

    start() {
        if (!this.game.isRunning()) {
            this.game.start();
            this.stepInterval = setInterval(() => {
                this.game.step();
                if (this.game.isFinished()) {
                    this.stop();
                }
            }, TICK_TIME);
        }
    }

    finish() {
        this.stop();
        this.game.finish();
    }

    pause() {
        this.stop();
        this.game.pause();
    }
}
