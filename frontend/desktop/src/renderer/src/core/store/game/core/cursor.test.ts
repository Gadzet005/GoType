import {
    Cursor,
    CursorPosition,
    InputResult,
} from "@/core/store/game/core/cursor";
import { Language } from "@/core/utils/language";
import { Sentence } from "./sentence";
import { LetterState } from "./letter";

describe("GameField tests", () => {
    const englishLang = Language.byCode("eng")!;

    function testSentence(content: string, showTime: number = 0) {
        return new Sentence({
            content,
            showTime,
            introDuration: 0,
            activeDuration: 1,
            outroDuration: 0,
        });
    }

    function checkCursorPosition(
        position: CursorPosition | null,
        expectedSentence: number,
        expectedLetter: number
    ) {
        if (!position) {
            throw new Error("Invalid cursor position");
        }
        expect([position.sentence, position.letter]).toEqual([
            expectedSentence,
            expectedLetter,
        ]);
    }

    it("move cursor common usage", () => {
        const sentences = [testSentence("foo"), testSentence("bar")];
        const cursor = new Cursor(sentences, englishLang);

        checkCursorPosition(cursor.getPosition(0), 0, 0);

        expect(cursor.input(0, "o")).toBe(InputResult.incorrect);
        expect(sentences[0].letters[0].state).toBe(LetterState.mistake);
        checkCursorPosition(cursor.getPosition(0), 0, 1);

        expect(cursor.input(0, "o")).toBe(InputResult.correct);
        expect(sentences[0].letters[1].state).toBe(LetterState.success);
        checkCursorPosition(cursor.getPosition(0), 0, 2);

        expect(cursor.input(0, "o")).toBe(InputResult.correct);
        expect(sentences[0].letters[2].state).toBe(LetterState.success);
        checkCursorPosition(cursor.getPosition(0), 1, 0);

        expect(cursor.input(0, "b")).toBe(InputResult.correct);
        expect(sentences[1].letters[0].state).toBe(LetterState.success);
        checkCursorPosition(cursor.getPosition(0), 1, 1);

        expect(cursor.input(0, "o")).toBe(InputResult.incorrect);
        expect(sentences[1].letters[1].state).toBe(LetterState.mistake);
        checkCursorPosition(cursor.getPosition(0), 1, 2);

        expect(cursor.input(0, "r")).toBe(InputResult.correct);
        expect(sentences[1].letters[2].state).toBe(LetterState.success);
        expect(cursor.getPosition(0)).toBeNull();

        expect(cursor.input(0, "r")).toBe(InputResult.ignore);
        expect(cursor.getPosition(0)).toBeNull();
    });

    it("ignore non alphabet input letters", () => {
        const sentences = [testSentence("foo"), testSentence("bar")];
        const cursor = new Cursor(sentences, englishLang);

        const checkIgnored = () => {
            expect(cursor.input(0, "!")).toBe(InputResult.ignore);
            expect(cursor.input(0, " ")).toBe(InputResult.ignore);
            expect(cursor.input(0, "1")).toBe(InputResult.ignore);
        };

        checkIgnored();
        for (const c of "foobar") {
            expect(cursor.input(0, c)).toBe(InputResult.correct);
            checkIgnored();
        }
    });

    it("no case sensetive", () => {
        const cursor = new Cursor([testSentence("FOObarHello")], englishLang);
        for (const c of "fooBARHeLLO") {
            expect(cursor.input(0, c)).toBe(InputResult.correct);
        }
    });

    it("skip non alphabet letters in sentences", () => {
        const cursor = new Cursor(
            [
                testSentence(".@.!?!.@."),
                testSentence("..."),
                testSentence("!a"),
                testSentence("..."),
                testSentence("b!"),
                testSentence("!!c!!"),
                testSentence("?*?"),
            ],
            englishLang
        );

        checkCursorPosition(cursor.getPosition(0), 2, 1);

        expect(cursor.input(0, "a")).toBe(InputResult.correct);
        checkCursorPosition(cursor.getPosition(0), 4, 0);

        expect(cursor.input(0, "b")).toBe(InputResult.correct);
        checkCursorPosition(cursor.getPosition(0), 5, 2);

        expect(cursor.input(0, "c")).toBe(InputResult.correct);
        expect(cursor.getPosition(0)).toBeNull();
    });

    it("sentence become active", () => {
        const cursor = new Cursor([testSentence("foo", 1)], englishLang);

        expect(cursor.getPosition(0)).toBeNull();
        expect(cursor.input(0, "f")).toBe(InputResult.ignore);

        checkCursorPosition(cursor.getPosition(1), 0, 0);
        expect(cursor.input(1, "f")).toBe(InputResult.correct);
    });

    it("sentence become inactive", () => {
        const cursor = new Cursor(
            [testSentence("foo"), testSentence("bar", 1)],
            englishLang
        );

        checkCursorPosition(cursor.getPosition(0), 0, 0);
        expect(cursor.input(0, "f")).toBe(InputResult.correct);
        checkCursorPosition(cursor.getPosition(0), 0, 1);

        checkCursorPosition(cursor.getPosition(1), 1, 0);
        expect(cursor.input(1, "b")).toBe(InputResult.correct);
        checkCursorPosition(cursor.getPosition(1), 1, 1);

        expect(cursor.getPosition(2)).toBeNull();
        expect(cursor.input(2, "a")).toBe(InputResult.ignore);
    });

    it("intro and outro states", () => {
        const cursor = new Cursor(
            [
                new Sentence({
                    content: "foo",
                    showTime: 1,
                    introDuration: 1,
                    activeDuration: 1,
                    outroDuration: 1,
                }),
            ],
            englishLang
        );

        expect(cursor.getPosition(0)).toBeNull();
        expect(cursor.input(0, "f")).toBe(InputResult.ignore);

        expect(cursor.getPosition(1)).toBeNull();
        expect(cursor.input(1, "f")).toBe(InputResult.ignore);

        checkCursorPosition(cursor.getPosition(2), 0, 0);
        expect(cursor.input(2, "f")).toBe(InputResult.correct);
        checkCursorPosition(cursor.getPosition(2), 0, 1);

        expect(cursor.getPosition(3)).toBeNull();
        expect(cursor.input(3, "o")).toBe(InputResult.ignore);

        expect(cursor.getPosition(4)).toBeNull();
        expect(cursor.input(4, "o")).toBe(InputResult.ignore);
    });

    it("reset", () => {
        const cursor = new Cursor([testSentence("foo")], englishLang);

        checkCursorPosition(cursor.getPosition(0), 0, 0);
        expect(cursor.input(0, "f")).toBe(InputResult.correct);
        checkCursorPosition(cursor.getPosition(0), 0, 1);

        cursor.reset();

        checkCursorPosition(cursor.getPosition(0), 0, 0);
        expect(cursor.input(0, "f")).toBe(InputResult.correct);
        checkCursorPosition(cursor.getPosition(0), 0, 1);
    });

    it("skip non alphabet with inactive sentences", () => {
        const cursor = new Cursor(
            [testSentence("a..."), testSentence("...b", 1)],
            englishLang
        );

        checkCursorPosition(cursor.getPosition(0), 0, 0);

        expect(cursor.input(0, "a")).toBe(InputResult.correct);
        expect(cursor.getPosition(0)).toBeNull();
        expect(cursor.input(0, "b")).toBe(InputResult.ignore);

        checkCursorPosition(cursor.getPosition(1), 1, 3);
        expect(cursor.input(1, "b")).toBe(InputResult.correct);
        expect(cursor.getPosition(1)).toBeNull();
    });
});
