import { createDummyLevel } from "@tests/dummy/level";
import { createDummySentence } from "@tests/dummy/sentence";
import { Game } from "./game";
import { Level } from "./level";

describe("Game Tests", () => {
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

        game.input("f");
        expect(game.statistics.totalLetters).toBe(0);

        // step 1
        game.step(1);
        expect(game.time).toBe(1);
        expect(game.field.getVisibleSentences()).lengthOf(2);

        // step 2
        game.step(2);
        expect(game.time).toBe(2);
        expect(game.field.getVisibleSentences()).lengthOf(2);

        game.input("f");
        game.input("o");
        game.input("a");
        game.input("!");
        game.input("b");

        expect(game.statistics.totalLetters).toBe(4);

        // steps 3-5
        game.step(5);
        expect(game.time).toBe(5);
        expect(game.field.getVisibleSentences()).lengthOf(0);

        // steps 6-9
        game.step(9);
        expect(game.time).toBe(9);
        expect(game.field.getVisibleSentences()).lengthOf(1);

        // step 10
        game.step(10);
        expect(game.time).toBe(10);
        expect(game.field.getVisibleSentences()).lengthOf(0);
        expect(game.getProgress()).toBe(100);
        expect(game.isFinished()).toBeTruthy();
    });
});
