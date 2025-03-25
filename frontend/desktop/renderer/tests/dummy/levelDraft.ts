import { DraftInfo } from "@desktop-common/draft";
import { DraftSentenceInfo } from "@desktop-common/draft/sentence";
import { StyleClass } from "@desktop-common/draft/style";

export function createDummyLevelDraft(
    sentences: DraftSentenceInfo[] = [],
    styleClasses: StyleClass[] = []
): DraftInfo {
    return {
        id: 1,
        name: "dummy",
        audio: {
            name: "audio",
            ext: "mp3",
            url: "",
        },
        updateTime: 1000,
        background: null,
        sentences: sentences,
        styleClasses: styleClasses,
    };
}
