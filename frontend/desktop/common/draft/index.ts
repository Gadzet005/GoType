import { DraftSentenceData } from "./sentence";
import { StyleClassData } from "./style";
import { Asset } from "../asset";

export interface DraftData {
    id: number;
    name: string;
    updateTime: number;
    languageCode: string;
    sentences: DraftSentenceData[];
    styleClasses: StyleClassData[];
    audio: Asset | null;
    background: {
        asset: Asset | null;
        brightness: number;
    };
    publication: {
        levelId: number;
        name: string;
        description: string;
        preview: Asset | null;
    } | null;
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
        levelId: number;
        name: string;
        description: string;
        previewPath: string;
    };
}
