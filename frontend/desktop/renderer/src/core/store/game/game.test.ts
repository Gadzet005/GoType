import { Language } from "@/core/utils/language";
import { Game } from "./game";
import { createSentenceStyle } from "@tests/creation/style";

describe("Game Tests", () => {
    const englishLang = Language.byCode("eng")!;

    it("game unit", () => {
        const game = new Game({
            duration: 10,
            language: englishLang,
            sentences: [
                {
                    content: "foo",
                    showTime: 0,
                    introDuration: 1,
                    activeDuration: 2,
                    outroDuration: 1,
                    style: createSentenceStyle(),
                },
                {
                    content: "bar",
                    showTime: 2,
                    introDuration: 0,
                    activeDuration: 3,
                    outroDuration: 1,
                    style: createSentenceStyle(),
                },
                {
                    content: "baz",
                    showTime: 8,
                    introDuration: 1,
                    activeDuration: 1,
                    outroDuration: 0,
                    style: createSentenceStyle(),
                },
            ],
        });

        expect(game.isRunning()).toBeFalsy();

        game.start();
        game.input("f");
        expect(game.isRunning()).toBeTruthy();
        expect(game.isFinished()).toBeFalsy();
        expect(game.getProgress()).toBe(0);
        expect(game.statistics.totalLetters).toBe(0);

        game.step(1);
        game.input("f");
        game.input("o");
        game.input("o");
        game.input("b");
        expect(game.getVisibleSentences()).lengthOf(1);
        expect(game.statistics.totalLetters).toBe(3);

        game.step(2);
        game.input("b");
        game.input("a");
        game.input("r");
        game.input("b");
        expect(game.getVisibleSentences()).lengthOf(2);
        expect(game.statistics.totalLetters).toBe(6);

        game.step(4);
        expect(game.getVisibleSentences()).lengthOf(1);

        game.step(6);
        expect(game.getVisibleSentences()).lengthOf(0);

        game.step(8);
        expect(game.getVisibleSentences()).lengthOf(1);

        game.step(10);
        expect(game.isRunning()).toBeFalsy();
        expect(game.isFinished()).toBeTruthy();
        expect(game.getProgress()).toBe(1);
        expect(game.getVisibleSentences()).lengthOf(0);
    });
});
