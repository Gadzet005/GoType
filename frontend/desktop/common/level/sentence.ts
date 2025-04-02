import { SentenceStyle } from "./style";

/**
 * Represents a sentence with its content, display timing, style, and position.
 */
export interface SentenceInfo {
    /** The textual content of the sentence. */
    content: string;
    /** The time at which the sentence should be shown. */
    showTime: number;
    /** The duration for which the sentence should be displayed. */
    duration: number;
    /** The style attributes applied to the sentence. */
    style: SentenceStyle;

    /**
     * The coordinates of the sentence's position on the screen,
     * expressed in percentages.
     * (0%, 0%) represents the top left corner,
     * (100%, 100%) represents the bottom right corner.
     */
    coord: {
        x: number;
        y: number;
    };
}
