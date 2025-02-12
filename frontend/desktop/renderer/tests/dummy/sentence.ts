import { Sentence } from "@desktop-common/sentence";

export function createDummySentence(text: string, showTime = 1000): Sentence {
    return {
        content: text,
        showTime: showTime,
        duration: 2000,
        style: {
            animations: {
                fadeIn: {
                    duration: 1000,
                    letterDuration: 500,
                },
                fadeOut: {
                    duration: 1000,
                    letterDuration: 500,
                },
            },
            letter: {
                default: {
                    color: "black",
                },
                current: {
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
