import { Language } from "@desktop-common/language";
import { IGameField } from "./interface";
import { LetterState } from "./sentence";

export interface CursorMoveResult {
    isRight: boolean;
    isEndOfSentence: boolean;
}

/**
 * Represents a cursor for navigating and managing a game field.
 * This class provides functionality for cursor movement, letter processing,
 * and sentence management within the context of a typing game.
 */
export class FieldCursor {
    private readonly field: IGameField;
    private readonly lang: Language;

    constructor(field: IGameField, lang: Language) {
        this.field = field;
        this.lang = lang;
    }

    /**
     * Normalizes the cursor position.
     * This method processes sentences, initializes cursors, skip no alphabet simbols
     * and handles empty or completed sentences.
     */
    normalize() {
        let sentence;
        while ((sentence = this.field.getCurrentSentence())) {
            if (sentence.length === 0) {
                this.field.completeCurrentSentence();
                continue;
            }
            if (!sentence.cursor.isInited) {
                sentence.cursor.move();
            }

            while (
                !sentence.cursor.isOnEnd &&
                !this.lang.includes(sentence.cursorLetter)
            ) {
                sentence.setLetterState(
                    sentence.cursor.position,
                    LetterState.success
                );
                sentence.cursor.move();
            }

            if (sentence.cursor.isOnEnd) {
                this.field.completeCurrentSentence();
            } else {
                break;
            }
        }
    }

    /**
     * Moves the cursor based on the input letter and updates the sentence state.
     *
     * @param letter - The input letter to compare with the current letter at the cursor position.
     * @returns A CursorMoveResult object if the move is valid, null otherwise.
     *          The result contains information about whether the input was correct
     *          and if the end of the sentence has been reached.
     */
    move(letter: string): CursorMoveResult | null {
        if (!this.field.hasActiveSentences || !this.lang.includes(letter)) {
            return null;
        }

        const sentence = this.field.getCurrentSentence();
        if (!sentence) {
            return null;
        }

        const result: CursorMoveResult = {
            isRight:
                sentence.cursorLetter.toLowerCase() === letter.toLowerCase(),
            isEndOfSentence: false,
        };

        if (result.isRight) {
            sentence.setLetterState(
                sentence.cursor.position,
                LetterState.success
            );
        } else {
            sentence.setLetterState(
                sentence.cursor.position,
                LetterState.mistake
            );
        }

        sentence.cursor.move();
        this.normalize();

        result.isEndOfSentence = sentence.cursor.isOnEnd;

        return result;
    }
}
