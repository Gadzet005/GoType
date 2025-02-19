import { LevelDraftInfo } from "@desktop-common/draft";
import { DraftSentence } from "@desktop-common/draft/sentence";
import { StyleClass } from "@desktop-common/draft/style";

export function createDummyLevelDraft(
    sentences: DraftSentence[] = [],
    styleClasses: StyleClass[] = []
): LevelDraftInfo {
    return {
        id: 1,
        name: "dummy",
        audio: {
            type: "mp3",
            url: "",
        },
        updateTime: 1000,
        background: null,
        sentences: sentences,
        styleClasses: styleClasses,
    };
}
