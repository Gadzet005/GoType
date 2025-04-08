import { DraftData } from "@desktop-common/draft";
import { DraftSentenceData } from "@desktop-common/draft/sentence";
import { StyleClassData } from "@desktop-common/draft/style";

export function createLevelDraft(
    sentences: DraftSentenceData[] = [],
    styleClasses: StyleClassData[] = []
): DraftData {
    return {
        id: 1,
        name: "dummy",
        audio: {
            ext: "mp3",
            url: "",
        },
        languageCode: "eng",
        updateTime: 1000,
        background: {
            asset: {
                ext: "jpg",
                url: "",
            },
            brightness: 0.5,
        },
        sentences: sentences,
        styleClasses: styleClasses,
        publication: null,
    };
}
