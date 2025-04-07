import { getDefaultDraftName } from "@/consts";
import { DraftSentenceData } from "@desktop-common/draft/sentence";
import { StyleClassData } from "@desktop-common/draft/style";

export interface StoredDraftData {
    id: number;
    name: string;
    updateTime: number;
    audio: string | null;
    background: {
        asset: string | null;
        brightness: number;
    };
    languageCode: string;
    sentences: DraftSentenceData[];
    styleClasses: StyleClassData[];
    publication: {
        levelId: number;
        name: string;
        description: string;
        preview: string | null;
    } | null;
}

export function defaultStoredDraftData(id: number): StoredDraftData {
    return {
        id,
        styleClasses: [],
        sentences: [],
        background: {
            asset: null,
            brightness: 1,
        },
        audio: null,
        name: getDefaultDraftName(id),
        updateTime: Date.now(),
        languageCode: "eng",
        publication: null,
    };
}
