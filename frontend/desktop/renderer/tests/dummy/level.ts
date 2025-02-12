import { Level } from "@desktop-common/level";
import { Sentence } from "@desktop-common/sentence";

export function createDummyLevel(
    sentences: Sentence[],
    duration: number = 10
): Level {
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
            type: "jpg",
            url: "",
        },
        tags: [],
        languageCode: "eng",
        game: {
            audio: {
                type: "mp3",
                url: "",
            },
            background: {
                type: "jpg",
                url: "",
            },
            sentences: sentences,
        },
    };
}
