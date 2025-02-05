import { Sentence } from "@desktop-common/sentence";
import { GameFieldSentence } from "./sentence";

export interface IGameField {
    /** Indicates whether there are active sentences in the game field */
    hasActiveSentences: boolean;

    /**
     * Retrieves all sentences currently in the game field
     * @returns An array of GameFieldSentence objects
     */
    getAllSentences(): GameFieldSentence[];

    /**
     * Gets the current active sentence in the game field
     * @returns The current GameFieldSentence object, or null if there is no active sentence
     */
    getCurrentSentence(): GameFieldSentence | null;

    /**
     * Adds a new sentence to the game field
     * @param sentence - The Sentence object to be added to the game field
     */
    addSentence(sentence: Sentence): void;

    /**
     * Marks the current sentence as completed
     */
    completeCurrentSentence(): void;

    /**
     * Removes the first sentence from the game field, if it exists
     */
    removeSentence(): void;

    /**
     * Removes all sentences from the game field
     */
    removeAllSentences(): void;
}
