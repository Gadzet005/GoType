export interface SentenceColors {
    default: string;
    active: string;
    mistake: string;
    success: string;
}

export interface SentenceStyle {
    font: string;
    fontSize: number;
    bold: boolean;

    padding: number;
    rotation: number;
    borderRadius: number;
    bgcolor?: string;

    colors: SentenceColors;

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
