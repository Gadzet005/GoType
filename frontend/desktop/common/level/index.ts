import { SentenceInfo } from "./sentence";
import { Asset } from "../asset";

export interface LevelInfo {
    id: number;
    name: string;
    description: string;
    author: {
        id: number;
        name: string;
    };
    /** in ticks */
    duration: number;
    tags: string[];
    languageCode: string;
    preview: Asset;
    audio: Asset;
    background: {
        asset: Asset;
        brightness: number;
    };
    sentences: SentenceInfo[];
}
