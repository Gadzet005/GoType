import { SentenceColors } from "../level/style";

export interface StyleClassData {
    name: string;
    introDurationRatio: number;
    outroDurationRatio: number;

    font: string;
    fontSize: number;
    bold: boolean;

    padding: number;
    borderRadius: number;
    bgcolor?: string;

    colors: SentenceColors;
}
