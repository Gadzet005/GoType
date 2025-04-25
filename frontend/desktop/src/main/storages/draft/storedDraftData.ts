import { getDefaultDraftName } from "../../consts";
import { DraftSentenceData } from "@common/draft/sentence";
import { StyleClassData } from "@common/draft/style";

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
        levelId: number | null;
        levelName: string;
        description: string;
        preview: string | null;
        difficulty: number;
    };
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
        publication: {
            levelId: null,
            levelName: "",
            description: "",
            preview: null,
            difficulty: 1,
        },
    };
}
