import { LevelInfo } from "@desktop-common/level";
import { SentenceInfo } from "@desktop-common/level/sentence";

export function createDummyLevel(
    sentences: SentenceInfo[] = [],
    duration: number = 10
): LevelInfo {
    return {
        id: 1,
        name: "dummy",
        description: "dummy",
        author: {
            id: 1,
            name: "John Doe",
        },
        duration: duration,
        preview: {
            ext: "jpg",
            url: "",
        },
        tags: [],
        languageCode: "eng",
        audio: {
            ext: "mp3",
            url: "",
        },
        background: {
            asset: {
                ext: "jpg",
                url: "",
            },
            brightness: 0.5,
        },
        sentences: sentences,
    };
}
