export interface LetterStyle {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
}

export interface FadeAnimation {
    /** milliseconds */
    duration: number;
    /** milliseconds */
    letterDuration: number;
    easing?: string;
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
