import { GameState } from "@/core/store/game/state";
import { Language } from "@desktop-common/language";
import { createDummySentence } from "../dummy/sentence";
import {
    AddSentenceEvent,
    RemoveSentenceEvent,
} from "@/core/store/game/events/wordEvents";

describe("events tests", () => {
    const eng = Language.byCode("eng")!;

    it("add/remove sentence events", () => {
        const gameState = new GameState(eng);
        gameState.init([]);
        const sentence1 = createDummySentence("hello", 0);
        const sentence2 = createDummySentence("world", 1000);
        const addSentenceEvent1 = new AddSentenceEvent(sentence1);
        const addSentenceEvent2 = new AddSentenceEvent(sentence2);
        const removeSentenceEvent = new RemoveSentenceEvent();

        addSentenceEvent1.run(gameState);
        expect(gameState.field.getAllSentences().length).toBe(1);
        addSentenceEvent2.run(gameState);
        expect(gameState.field.getAllSentences().length).toBe(2);
        removeSentenceEvent.run(gameState);
        expect(gameState.field.getAllSentences().length).toBe(1);
        removeSentenceEvent.run(gameState);
        expect(gameState.field.getAllSentences().length).toBe(0);
        removeSentenceEvent.run(gameState);
        expect(gameState.field.getAllSentences().length).toBe(0);
    });
});
