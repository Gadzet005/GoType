import { GameState } from "@/core/store/game/state";
import { Language } from "@desktop-common/language";
import { createDummySentence } from "../dummy/sentence";

describe("GameState", () => {
    const eng = Language.byCode("eng")!;

    it("init", () => {
        const gameState = new GameState(eng);
        gameState.init([
            createDummySentence("world", 0),
            createDummySentence("hello", 1000),
        ]);

        expect(gameState.field.getAllSentences().length).toBe(0);
        expect(gameState.events.getEvents(0).length).toBe(1);
        expect(gameState.events.getEvents(1000).length).toBe(1);
    });
});
