export interface LetterStyle {
    font: string;
    fontSize: number;
    color: string;
    bold: boolean;
}

export interface SentenceLetterStyles {
    default: LetterStyle;
    active: LetterStyle;
    mistake: LetterStyle;
    success: LetterStyle;
}

export interface SentenceStyle {
    padding: number;
    rotation: number;
    borderRadius: number;
    bgcolor?: string;

    letter: SentenceLetterStyles;
}
