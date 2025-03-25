export interface LetterStyle {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
}

export interface SentenceLetterStyles {
    default: LetterStyle;
    active: LetterStyle;
    mistake: LetterStyle;
    success: LetterStyle;
}

export interface SimpleAnimation {
    /** in ticks */
    duration: number;
}

export interface SentenceAnimations {
    intro: SimpleAnimation;
    outro: SimpleAnimation;
}

export interface SentenceStyle {
    padding?: number;
    bgcolor?: string;
    rotate?: number;
    borderRadius?: number;

    letter: SentenceLetterStyles;
    animations: SentenceAnimations;
}
