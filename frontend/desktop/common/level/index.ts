import { Sentence } from "./sentence";
import { Asset } from "../asset";

export interface LevelData {
    id: number;
    name: string;
    description: string;
    author: {
        id: number;
        name: string;
    };
    //** seconds */
    duration: number;
    tags: string[];
    languageCode: string;
    preview: Asset;
    game: {
        audio: Asset;
        background: Asset;
        sentences: Sentence[];
    };
}
