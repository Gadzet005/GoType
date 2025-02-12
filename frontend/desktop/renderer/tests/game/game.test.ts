import { Game } from "@/core/store/game";
import { createDummyLevel } from "./dummy/level";

describe("Game tests", () => {
    it("init", () => {
        const level = createDummyLevel([]);
        const game = new Game(level);
        game.init();

        expect(game.isFinished || game.isPaused || game.isRunning).toBe(false);
        expect(game.progress).toBe(0);
        expect(game.state.field.getAllSentences().length).toBe(0);
    });

    it("running", () => {
        const level = createDummyLevel([]);
        const game = new Game(level);
        game.init();
        game.start();

        expect(game.isRunning).toBe(true);
    });

    it("pause", () => {
        const level = createDummyLevel([]);
        const game = new Game(level);
        game.init();
        game.start();
        game.pause();

        expect(game.isPaused).toBe(true);
    });

    it("finish", () => {
        const level = createDummyLevel([]);
        const game = new Game(level);
        game.init();
        game.start();
        game.finish();

        expect(game.isFinished).toBe(true);
        expect(game.state.field.getAllSentences().length).toBe(0);
    });
});
