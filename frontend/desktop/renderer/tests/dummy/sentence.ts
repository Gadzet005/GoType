import { SentenceInfo } from "@desktop-common/level/sentence";

export function createDummySentence(
    text: string,
    showTime = 1000,
    duration = 1000,
    introDuration = 200,
    outroDuration = 200
): SentenceInfo {
    return {
        content: text,
        showTime: showTime,
        duration: duration,
        style: {
            animations: {
                intro: {
                    duration: introDuration,
                },
                outro: {
                    duration: outroDuration,
                },
            },
            letter: {
                default: {
                    color: "black",
                },
                active: {
                    color: "blue",
                },
                mistake: {
                    color: "red",
                },
                success: {
                    color: "green",
                },
            },
        },
        coord: {
            x: 0,
            y: 0,
        },
    };
}
