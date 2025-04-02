import { SentenceStyle } from "@desktop-common/level/style";

export function createSentenceStyle(
    options?: Partial<SentenceStyle>
): SentenceStyle {
    return {
        font: "Onest",
        fontSize: 50,
        bold: true,
        padding: 0,
        rotation: 0,
        borderRadius: 3,
        colors: {
            default: "#000000",
            active: "#0693e3",
            mistake: "#eb144c",
            success: "#00d084",
        },
        coord: {
            x: 50,
            y: 50,
        },
        ...options,
    };
}
