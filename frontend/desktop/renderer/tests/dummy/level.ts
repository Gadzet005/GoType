import { LevelData } from "@desktop-common/level";
import { Sentence } from "@desktop-common/level/sentence";

export function createDummyLevel(
    sentences: Sentence[] = [],
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
        game: {
            audio: {
                ext: "mp3",
                url: "",
            },
            background: {
                ext: "jpg",
                url: "",
            },
            sentences: sentences,
        },
    };
}
