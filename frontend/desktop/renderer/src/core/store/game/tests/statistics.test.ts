import { GameStatistics } from "@/core/store/game/statistics";
import { Language } from "@desktop-common/language";
import { GameScore } from "@/core/store/game/consts";

const eng = Language.byCode("eng")!;

describe("GameStatistics tests", () => {
    it("reset", () => {
        const statistics = new GameStatistics(eng);
        statistics.addInputResult("a", true);
        statistics.addInputResult("b", false);
        statistics.reset();

        expect(statistics.score).toBe(0);
        expect(statistics.totalLetters).toBe(0);
        expect(statistics.rightLetters).toBe(0);
        expect(statistics.accuracy).toBe(100);
        expect(statistics.comboCounter).toBe(1);
        expect(statistics.maxCombo).toBe(1);
    });

    it("addInputResult", () => {
        const statistics = new GameStatistics(eng);
        const input = [
            ["a", true],
            ["b", false],
            ["a", true],
            ["b", true],
            [".", true],
            [".", false],
        ];
        input.forEach(([letter, isRight]) =>
            statistics.addInputResult(letter as string, isRight as boolean)
        );

        expect(statistics.score).toBeGreaterThanOrEqual(GameScore.letter * 3);
        expect(statistics.rightLetters).toBe(3);
        expect(statistics.totalLetters).toBe(4);
        expect(statistics.accuracy).toBe(75);
    });

    it("total", () => {
        const statistics = new GameStatistics(eng);
        const input = [
            ["a", true],
            ["b", false],
            ["a", true],
            ["a", true],
            ["c", false],
            [".", true],
            [".", false],
        ];
        input.forEach(([letter, isRight]) =>
            statistics.addInputResult(letter as string, isRight as boolean)
        );
        const total = statistics.alphabetTotal;

        expect(total[0]).toEqual({ letter: "a", total: 3 });
        expect(total[1]).toEqual({ letter: "b", total: 1 });
        expect(total[2]).toEqual({ letter: "c", total: 1 });
        expect(total[3]).toEqual({ letter: "d", total: 0 });
    });

    it("ratio", () => {
        const statistics = new GameStatistics(eng);
        const input = [
            ["a", true],
            ["a", true],
            ["a", false],
            ["b", true],
            ["b", false],
            ["b", false],
            ["c", false],
            ["d", true],
            [".", true],
            [".", false],
        ];
        input.forEach(([letter, isRight]) =>
            statistics.addInputResult(letter as string, isRight as boolean)
        );
        const ratio = statistics.alphabetRatio;

        expect(ratio[0].ratio).toBeCloseTo(66.67, 1);
        expect(ratio[1].ratio).toBeCloseTo(33.33, 1);
        expect(ratio[2].ratio).toEqual(0);
        expect(ratio[3].ratio).toEqual(100);
        expect(ratio[4].ratio).toEqual(100);

        expect(statistics.accuracy).toEqual(50);
        expect(statistics.rightLetters).toEqual(4);
        expect(statistics.totalLetters).toEqual(8);
    });

    it("combo", () => {
        const statistics = new GameStatistics(eng);
        const input = [
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
            statistics.addInputResult(letter as string, isRight as boolean)
        );

        expect(statistics.comboCounter).toEqual(3);
        expect(statistics.maxCombo).toEqual(4);
    });
});
