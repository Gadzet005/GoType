import { AnimationEasing, millisecond } from "../types";

export interface LetterStyle {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
}

export interface FadeAnimation {
    duration: millisecond;
    letterDuration: millisecond;
    easing?: AnimationEasing;
}

export interface SentenceAnimations {
    fadeIn: FadeAnimation;
    fadeOut: FadeAnimation;
}

export interface SentenceStyle {
    padding?: number;
    bgcolor?: string;
    rotate?: number;
    borderRadius?: number;

    letter: {
        default: LetterStyle;
        current: LetterStyle;
        mistake: LetterStyle;
        success: LetterStyle;
    };

    animations: SentenceAnimations;
}
