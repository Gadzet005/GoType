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

    /** from 0 to 1 */
    introDurationRatio: number;
    /** from 0 to 1 */
    outroDurationRatio: number;

    colors: SentenceColors;
}
