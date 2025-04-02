import { SentenceStyle } from "./style";

export interface SentenceInfo {
    /** The textual content of the sentence. */
    content: string;
    /** The time at which the sentence should be shown. */
    showTime: number;

    /** Duration of appearence state (for animation). */
    introDuration: number;
    /** Duration of active state (for interaction). */
    activeDuration: number;
    /** Duration of disappearance state (for animation). */
    outroDuration: number;
}

export interface StyledSentenceInfo extends SentenceInfo {
    /** The style attributes applied to the sentence. */
    style: SentenceStyle;
}
