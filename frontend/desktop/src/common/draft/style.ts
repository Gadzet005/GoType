import { SentenceStyle } from "../level/style";

export interface StyleClassData extends Omit<SentenceStyle, "coord"> {
    name: string;
    introDurationRatio: number;
    outroDurationRatio: number;
}
