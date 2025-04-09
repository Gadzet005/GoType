import {
    GameStatistics,
    StatInputResultType,
} from "@/core/store/game/statistics";
import { Language } from "@/core/utils/language";
import { Score } from "@/core/config/game.config";

describe("GameStatistics tests", () => {
    const englishLang = Language.byCode("eng")!;

    it("reset", () => {
        const statistics = new GameStatistics(englishLang, 10);
        statistics.addInputResult({
            letter: "a",
            type: StatInputResultType.correct,
            time: 0,
        });
        statistics.addInputResult({
            letter: "b",
            type: StatInputResultType.incorrect,
            time: 1,
        });
        statistics.reset();

        expect(statistics.score).toBe(0);
        expect(statistics.totalLetters).toBe(0);
        expect(statistics.totalMistakes).toBe(0);
        expect(statistics.accuracy).toBe(100);
        expect(statistics.comboCounter).toBe(1);
        expect(statistics.maxCombo).toBe(1);
    });

    it("addInputResult", () => {
        const statistics = new GameStatistics(englishLang, 10);
        const input: [string, boolean][] = [
            ["a", true],
            ["b", false],
            ["a", true],
            ["b", true],
            [".", true],
            [".", false],
        ];
        input.forEach(([letter, isRight]) =>
            statistics.addInputResult({
                letter: letter,
                type: isRight
                    ? StatInputResultType.correct
                    : StatInputResultType.incorrect,
                time: 0,
            })
        );

        expect(statistics.score).toBeGreaterThanOrEqual(Score.letter * 3);
        expect(statistics.totalMistakes).toBe(1);
        expect(statistics.totalLetters).toBe(4);
        expect(statistics.accuracy).toBe(75);
    });

    it("total", () => {
        const statistics = new GameStatistics(englishLang, 10);
        const input: [string, boolean][] = [
            ["a", true],
            ["b", false],
            ["a", true],
            ["a", true],
            ["c", false],
            [".", true],
            [".", false],
        ];
        input.forEach(([letter, isRight]) =>
            statistics.addInputResult({
                letter: letter,
                type: isRight
                    ? StatInputResultType.correct
                    : StatInputResultType.incorrect,
                time: 0,
            })
        );
        const total = statistics.alphabetStat;

        expect(total[0]).toEqual({ letter: "a", total: 3, mistakes: 0 });
        expect(total[1]).toEqual({ letter: "b", total: 1, mistakes: 1 });
        expect(total[2]).toEqual({ letter: "c", total: 1, mistakes: 1 });
        expect(total[3]).toEqual({ letter: "d", total: 0, mistakes: 0 });
    });

    it("combo", () => {
        const statistics = new GameStatistics(englishLang, 10);
        const input: [string, boolean][] = [
            ["a", true],
            ["c", true],
            ["d", true],
            ["b", false],
            [".", false],
            ["a", true],
            ["b", true],
            [".", true],
            [".", false],
        ];

        input.forEach(([letter, isRight]) =>
            statistics.addInputResult({
                letter: letter,
                type: isRight
                    ? StatInputResultType.correct
                    : StatInputResultType.incorrect,
                time: 0,
            })
        );

        expect(statistics.comboCounter).toEqual(3);
        expect(statistics.maxCombo).toEqual(4);
    });
});
