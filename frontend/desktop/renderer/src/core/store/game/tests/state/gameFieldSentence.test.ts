import {
    GameFieldSentence,
    LetterState,
    SentenceCursor,
} from "@/core/store/game/field/sentence";
import { createDummySentence } from "../../../../../../tests/dummy/sentence";

describe("Sentence tests", () => {
    const sentence = createDummySentence("hello");

    it("sentence cursor isInited", () => {
        const cursor = new SentenceCursor(10);

        expect(cursor.isInited).toBe(false);
        cursor.move();
        expect(cursor.isInited).toBe(true);
        expect(cursor.isInited).toBe(true);
        cursor.move();
        expect(cursor.isInited).toBe(true);
    });

    it("sentence cursor move", () => {
        const cursor = new SentenceCursor(3);

        expect(cursor.move()).toBe(true);
        expect(cursor.move()).toBe(true);
        expect(cursor.move()).toBe(true);
        expect(cursor.move()).toBe(false);
        expect(cursor.move()).toBe(false);
    });

    it("sentence cursor position", () => {
        const cursor = new SentenceCursor(3);

        cursor.move();
        cursor.move();
        expect(cursor.position).toBe(1);
    });

    it("sentence cursor isOnEnd", () => {
        const cursor = new SentenceCursor(3);

        cursor.move();
        cursor.move();
        cursor.move();
        expect(cursor.isOnEnd).toBe(false);
        cursor.move();
        expect(cursor.isOnEnd).toBe(true);
    });

    it("getLetterStyle", () => {
        const gameFieldSentence = new GameFieldSentence(1, sentence);
        gameFieldSentence.setLetterState(0, LetterState.mistake);
        gameFieldSentence.setLetterState(1, LetterState.success);

        const states = [
            LetterState.mistake,
            LetterState.success,
            LetterState.default,
        ];
        const steps = [
            ["red", "green", "black"],
            ["blue", "green", "black"],
            ["red", "blue", "black"],
            ["red", "green", "blue"],
            ["red", "green", "black"],
        ];

        for (let i = 0; i < steps.length; i++) {
            for (let j = 0; j < 3; j++) {
                expect(gameFieldSentence.getLetterStyle(j)).toEqual({
                    color: steps[i][j],
                });
                expect(gameFieldSentence.getLetterState(j)).toEqual(states[j]);
            }
            gameFieldSentence.cursor.move();
        }
    });

    it("other", () => {
        const gameFieldSentence = new GameFieldSentence(1, sentence);
        expect(gameFieldSentence.length).toBe(sentence.content.length);

        for (let i = 0; i < gameFieldSentence.length; i++) {
            gameFieldSentence.cursor.move();
            expect(gameFieldSentence.cursorLetter).toBe(sentence.content[i]);
        }
    });
});
