import { SentenceStyle } from "../level/style";

export interface SentenceStyleClass extends Omit<SentenceStyle, "coord"> {
    introDurationRatio: number;
    outroDurationRatio: number;
}

export interface NamedSentenceStyleClass extends SentenceStyleClass {
    name: string;
}
