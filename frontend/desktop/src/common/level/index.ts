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
    difficulty: number;
    preview: AssetRef;
    audio: AssetRef;
    background: {
        asset: AssetRef;
        brightness: number;
    };
    sentences: SentenceData[];
}

export interface ExternalLevelData {
    name: string;
    description: string;
    author: {
        id: number;
        name: string;
    };
    duration: number;
    tags: string[];
    languageCode: string;
    difficulty: number;
    previewExt: string;
    audioExt: string;
    background: {
        ext: string;
        brightness: number;
    };
    sentences: SentenceData[];
}
