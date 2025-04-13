import { SentenceData } from "./sentence";
import { AssetRef } from "../asset";

export interface LevelData {
    id: number;
    name: string;
    description: string;
    author: {
        id: number;
        name: string;
    };
    duration: number;
    tags: string[];
    languageCode: string;
    preview: AssetRef;
    audio: AssetRef;
    background: {
        asset: AssetRef;
        brightness: number;
    };
    sentences: SentenceData[];
}
