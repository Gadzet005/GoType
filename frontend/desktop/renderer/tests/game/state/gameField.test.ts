import { createDummySentence } from "../dummy/sentence";
import { GameField } from "@/core/store/game/field";
import { Language } from "@desktop-common/language";

const eng = Language.byCode("eng")!;

test("GameField.addSentence", () => {
    const field = new GameField(eng);
    const sentence1 = createDummySentence("foo");
    const sentence2 = createDummySentence("bar");

    expect(field.hasActiveSentences).toBe(false);
    expect(field.getAllSentences().length).toBe(0);
    expect(field.getCurrentSentence()).toBeNull();

    field.addSentence(sentence1);

    expect(field.hasActiveSentences).toBe(true);
    expect(field.getAllSentences().length).toBe(1);
    expect(field.getCurrentSentence()?.content).toEqual(sentence1.content);

    field.addSentence(sentence2);

    expect(field.getCurrentSentence()!.content).toEqual(sentence1.content);
    expect(field.getAllSentences().length).toBe(2);
});

test("GameField.removeSentence", () => {
    const field = new GameField(eng);
    const sentence1 = createDummySentence("foo");
    const sentence2 = createDummySentence("bar");

    field.addSentence(sentence1);
    field.addSentence(sentence2);
    field.completeCurrentSentence();

    expect(field.getAllSentences().length).toBe(2);

    field.removeSentence();

    expect(field.getAllSentences().length).toBe(1);
    expect(field.getCurrentSentence()?.content).toEqual(sentence2.content);

    field.removeSentence();

    expect(field.getAllSentences().length).toBe(0);
});

test("GameField.removeAllSentences", () => {
    const field = new GameField(eng);
    const sentence1 = createDummySentence("foo");
    const sentence2 = createDummySentence("bar");

    field.addSentence(sentence1);
    field.addSentence(sentence2);
    field.completeCurrentSentence();
    field.removeAllSentences();

    expect(field.getAllSentences().length).toBe(0);
});

test("GameField.completeCurrentSentence", () => {
    const field = new GameField(eng);
    const sentence = createDummySentence("foo");

    field.addSentence(sentence);
    field.completeCurrentSentence();

    expect(field.getAllSentences().length).toBe(1);
    expect(field.hasActiveSentences).toBe(false);
});

test("GameField.moveCursor 1", () => {
    const field = new GameField(eng);
    const sentence1 = createDummySentence("foo");
    const sentence2 = createDummySentence("bar");
    const emptySentence = createDummySentence("");

    field.addSentence(emptySentence);
    field.addSentence(sentence1);
    field.addSentence(emptySentence);
    field.addSentence(sentence2);
    field.addSentence(emptySentence);

    expect(field.cursor.move("f")).toEqual({
        isRight: true,
        isEndOfSentence: false,
    });
    expect(field.cursor.move("f")).toEqual({
        isRight: false,
        isEndOfSentence: false,
    });
    expect(field.cursor.move("o")).toEqual({
        isRight: true,
        isEndOfSentence: true,
    });
    expect(field.getCurrentSentence()?.content).equal(sentence2.content);
    expect(field.cursor.move("p")).toEqual({
        isRight: false,
        isEndOfSentence: false,
    });
    expect(field.cursor.move("a")).toEqual({
        isRight: true,
        isEndOfSentence: false,
    });
    expect(field.cursor.move("r")).toEqual({
        isRight: true,
        isEndOfSentence: true,
    });
    expect(field.getCurrentSentence()).toBeNull();
    expect(field.hasActiveSentences).toBe(false);
});

test("GameField.moveCursor 2", () => {
    const field = new GameField(eng);
    const sentence1 = createDummySentence("!?!f!o.!.o!...!");
    field.addSentence(sentence1);

    expect(field.cursor.move("!")).toEqual(null);
    expect(field.cursor.move("f")).toEqual({
        isRight: true,
        isEndOfSentence: false,
    });
    expect(field.cursor.move("!")).toEqual(null);
    expect(field.cursor.move("p")).toEqual({
        isRight: false,
        isEndOfSentence: false,
    });
    expect(field.cursor.move(".")).toEqual(null);
    expect(field.cursor.move("!")).toEqual(null);
    expect(field.cursor.move("o")).toEqual({
        isRight: true,
        isEndOfSentence: true,
    });
    expect(field.getCurrentSentence()).toBeNull();
    expect(field.cursor.move("o")).toBeNull();
});
