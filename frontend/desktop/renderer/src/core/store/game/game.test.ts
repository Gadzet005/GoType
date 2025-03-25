import { createDummyLevel } from "@tests/dummy/level";
import { createDummySentence } from "@tests/dummy/sentence";
import { Game } from "./game";
import { Level } from "./level";

describe("Game Tests", () => {
    function steps(game: Game, n: number) {
        for (let i = 0; i < n; i++) {
            game.step();
        }
    }

    it("game unit", () => {
        const sentence1 = createDummySentence("foo", 0, 4, 1, 1);
        const sentence2 = createDummySentence("bar", 1, 3, 1, 1);
        const sentence3 = createDummySentence("p", 9, 1, 0, 0);
        const level = createDummyLevel([sentence1, sentence2, sentence3], 10);

        const game = new Game(new Level(level));

        expect(game.isRunning()).toBeFalsy();

        game.start();
        expect(game.isRunning()).toBeTruthy();
        expect(game.isFinished()).toBeFalsy();
        expect(game.getProgress()).toBe(0);

        // step 1
        steps(game, 1);
        expect(game.tick).toBe(1);
        expect(game.field.getVisibleSentences().length).toBe(1);

        game.input("f");
        expect(game.statistics.totalLetters).toBe(0);

        // step 2
        steps(game, 1);
        expect(game.tick).toBe(2);
        expect(game.field.getVisibleSentences().length).toBe(2);

        game.input("f");
        game.input("o");
        game.input("a");
        game.input("!");
        game.input("b");

        expect(game.statistics.totalLetters).toBe(3);

        // steps 3-5
        steps(game, 3);
        expect(game.tick).toBe(5);
        expect(game.field.getVisibleSentences().length).toBe(0);

        // steps 6-10
        steps(game, 5);
        expect(game.tick).toBe(10);
        expect(game.field.getVisibleSentences().length).toBe(1);

        game.input("p");
        game.input("p");
        expect(game.statistics.totalLetters).toBe(4);

        // last step
        steps(game, 1);
        expect(game.tick).toBe(10);
        expect(game.field.getVisibleSentences().length).toBe(0);

        expect(game.getProgress()).toBe(100);
        expect(game.isFinished()).toBeTruthy();
    });
});
