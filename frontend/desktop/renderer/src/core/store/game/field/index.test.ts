import { createDummySentence } from "@tests/dummy/sentence";
import { Cursor, GameField, MoveCursorResult } from "@/core/store/game/field";
import { Language } from "@/core/utils/language";
import { SentenceState } from "./sentence";

describe("GameField tests", () => {
    const lang = Language.default();

    function getDummyField() {
        const sentence1 = createDummySentence("foo");
        const sentence2 = createDummySentence("bar");
        return new GameField([sentence1, sentence2], lang);
    }

    function cursor(sentence: number, position: number): Cursor {
        return { sentence, position };
    }

    function checkSentences(
        field: GameField,
        a: SentenceState,
        b: SentenceState
    ) {
        expect(field.getSentence(0).state == a);
        expect(field.getSentence(1).state == b);
    }

    it("show first sentence", () => {
        const field = getDummyField();

        field.showFirstSentence();
        checkSentences(field, SentenceState.intro, SentenceState.initial);

        field.showFirstSentence();
        checkSentences(field, SentenceState.intro, SentenceState.intro);

        field.showFirstSentence();
        checkSentences(field, SentenceState.intro, SentenceState.intro);
    });

    it("activate first sentence", () => {
        const field = getDummyField();

        field.showFirstSentence();
        checkSentences(field, SentenceState.intro, SentenceState.initial);

        field.activateFirstSentence();
        checkSentences(field, SentenceState.active, SentenceState.initial);

        field.activateFirstSentence();
        checkSentences(field, SentenceState.active, SentenceState.initial);

        field.showFirstSentence();
        checkSentences(field, SentenceState.active, SentenceState.intro);

        field.activateFirstSentence();
        checkSentences(field, SentenceState.active, SentenceState.active);

        field.activateFirstSentence();
        checkSentences(field, SentenceState.active, SentenceState.active);
    });

    it("complete first sentence", () => {
        const field = getDummyField();

        field.showFirstSentence();
        field.activateFirstSentence();
        field.completeFirstSentence();
        checkSentences(field, SentenceState.outro, SentenceState.initial);

        field.showFirstSentence();
        field.completeFirstSentence();
        checkSentences(field, SentenceState.outro, SentenceState.intro);

        field.activateFirstSentence();
        field.completeFirstSentence();
        checkSentences(field, SentenceState.outro, SentenceState.outro);
    });

    it("hide first sentence", () => {
        const field = getDummyField();

        field.showFirstSentence();
        field.activateFirstSentence();
        field.completeFirstSentence();
        field.hideFirstSentence();
        checkSentences(field, SentenceState.hidden, SentenceState.initial);

        field.showFirstSentence();
        field.activateFirstSentence();
        field.hideFirstSentence();
        checkSentences(field, SentenceState.hidden, SentenceState.active);

        field.completeFirstSentence();
        field.hideFirstSentence();
        checkSentences(field, SentenceState.hidden, SentenceState.hidden);
    });

    it("move cursor", () => {
        const field = getDummyField();
        const inputs: [string, MoveCursorResult][] = [
            [" ", MoveCursorResult.ignore],
            ["f", MoveCursorResult.correct],
            ["a", MoveCursorResult.incorrect],
            ["o", MoveCursorResult.correct],
            [" ", MoveCursorResult.ignore],
            ["b", MoveCursorResult.correct],
            ["a", MoveCursorResult.correct],
            ["b", MoveCursorResult.incorrect],
            [" ", MoveCursorResult.ignore],
            ["a", MoveCursorResult.ignore],
        ];

        expect(field.moveCursor("f")).toBe(MoveCursorResult.ignore);

        field.showFirstSentence();
        field.showFirstSentence();

        expect(field.moveCursor("f")).toBe(MoveCursorResult.ignore);

        field.activateFirstSentence();
        field.activateFirstSentence();

        inputs.forEach(([input, expected], index) => {
            expect(field.moveCursor(input), `${index}) ${input}`).toBe(
                expected
            );
        });
    });

    it("get cursor", () => {
        const field = getDummyField();
        const inputs: [string, Cursor | null][] = [
            [" ", cursor(0, 0)],
            ["f", cursor(0, 1)],
            ["a", cursor(0, 2)],
            ["o", cursor(1, 0)],
            [" ", cursor(1, 0)],
            ["b", cursor(1, 1)],
            ["a", cursor(1, 2)],
            ["b", null],
            [" ", null],
        ];

        expect(field.getCursor()).toBeNull();

        field.showFirstSentence();
        field.showFirstSentence();

        expect(field.getCursor()).toBeNull();

        field.activateFirstSentence();
        field.activateFirstSentence();

        expect(field.getCursor()).toEqual(cursor(0, 0));

        inputs.forEach(([input, expected]) => {
            field.moveCursor(input);
            expect(field.getCursor()).toEqual(expected);
        });

        expect(field.getCursor()).toBeNull();
    });

    it("move cursor with no active words", () => {
        const field = getDummyField();

        field.moveCursor("f");
        field.moveCursor("o");
        field.moveCursor("o");

        expect(field.getCursor()).toBeNull();

        field.showFirstSentence();
        field.activateFirstSentence();

        expect(field.getCursor()).toEqual(cursor(0, 0));

        field.moveCursor("f");

        expect(field.getCursor()).toEqual(cursor(0, 1));
    });

    it("cursor should skip non language letters", () => {
        const sentence1 = createDummySentence("?*?");
        const sentence2 = createDummySentence("!a?(*)_(*)?b...");
        const field = new GameField([sentence1, sentence2], lang);

        field.showFirstSentence();
        field.activateFirstSentence();

        expect(field.getCursor()).toBeNull();

        field.showFirstSentence();
        field.activateFirstSentence();

        expect(field.getCursor()).toEqual(cursor(1, 1));
        expect(field.moveCursor("a")).toBe(MoveCursorResult.correct);
        expect(field.getCursor()).toEqual(cursor(1, 11));
        expect(field.moveCursor("b")).toBe(MoveCursorResult.correct);
        expect(field.getCursor()).toBeNull();
    });
});
