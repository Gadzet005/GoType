import { StyleClass } from "../types/game";

// Amount of score for actions in the game
export namespace Score {
    export const letter: number = 10;
}

export namespace Defaults {
    export const sentenceStyleClass: StyleClass = {
        padding: 0,
        borderRadius: 0,
        rotation: 0,
        font: "Onest",
        fontSize: 50,
        bold: true,
        introDurationRatio: 0.1,
        outroDurationRatio: 0.1,
        colors: {
            default: "#000000",
            active: "#0693e3",
            mistake: "#eb144c",
            success: "#00d084",
        },
    };
}

export const availableFonts = ["Onest", "Roboto"];

export namespace Constraints {
    export const maxPadding = 3;
    export const maxBorderRadius = 10;
    export const minFontSize = 10;
    export const maxFontSize = 100;
    export const maxIntroDurationPercent = 20;
    export const maxOutroDurationPercent = 20;
}

export namespace Accuracy {
    export const minAccuracy = 60;
    export const names = ["D", "C", "B", "A", "S"];
    export const thresholds = [minAccuracy, 70, 80, 90, 100];
}
