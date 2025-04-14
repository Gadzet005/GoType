import { LevelData } from "@common/level";
import { SentenceData } from "@common/level/sentence";

export function createLevel(
    sentences: SentenceData[] = [],
    duration: number = 10
): LevelData {
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
        difficulty: 1,
    };
}
