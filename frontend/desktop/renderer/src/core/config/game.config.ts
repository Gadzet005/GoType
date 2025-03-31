import { SentenceStyle } from "@desktop-common/level/style";

// 60 fps
export const tickTime = 16.6;

// Amount of score for actions in the game
export namespace Score {
    export const letter: number = 10;
}

export namespace Defaults {
    export const sentenceStyle: SentenceStyle = {
        padding: 0,
        borderRadius: 3,
        rotation: 0,
        letter: {
            default: {
                font: "Onest",
                fontSize: 40,
                bold: false,
                color: "#000000",
            },
            active: {
                font: "Onest",
                fontSize: 50,
                bold: true,
                color: "#0693e3",
            },
            mistake: {
                font: "Onest",
                fontSize: 40,
                bold: false,
                color: "#eb144c",
            },
            success: {
                font: "Onest",
                fontSize: 40,
                bold: false,
                color: "#00d084",
            },
        },
    };
}

export const availableFonts = ["Onest", "Roboto"];

export namespace Constraints {
    export const maxPadding = 3;
    export const maxBorderRadius = 10;
    export const minFontSize = 10;
    export const maxFontSize = 100;
}
