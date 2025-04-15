import { DraftSentenceData } from "./sentence";
import { StyleClassData } from "./style";
import { AssetRef } from "../asset";

export interface DraftData {
    id: number;
    name: string;
    updateTime: number;
    languageCode: string;
    sentences: DraftSentenceData[];
    styleClasses: StyleClassData[];
    audio: AssetRef | null;
    background: {
        asset: AssetRef | null;
        brightness: number;
    };
    publication: {
        levelId: number | null;
        levelName: string;
        description: string;
        difficulty: number;
        preview: AssetRef | null;
    };
}

export interface DraftUpdateData {
    id: number;
    name?: string;
    sentences?: DraftSentenceData[];
    styleClasses?: StyleClassData[];
    languageCode?: string;
    background?: {
        path?: string;
        brightness?: number;
    };
    audioPath?: string;
    publication?: {
        levelId?: number;
        levelName?: string;
        description?: string;
        difficulty?: number;
        previewPath?: string;
    };
}

export interface LevelCreationData {
    draft: DraftData;
    preview: string;
    audio: string;
    background: string;
}
