import { Sentence } from "../level/sentence";

export interface DraftSentence extends Omit<Sentence, "style"> {
    styleClass: string;
}
