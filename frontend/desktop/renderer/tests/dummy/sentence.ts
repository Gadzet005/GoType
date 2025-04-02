import { createSentenceStyle } from "@/core/utils/create";
import { SentenceInfo } from "@desktop-common/level/sentence";

export function createDummySentence(
    text: string,
    showTime = 1000,
    duration = 1000,
    introDurationRatio = 0.1,
    outroDurationRatio = 0.1
): SentenceInfo {
    return {
        content: text,
        showTime: showTime,
        duration: duration,
        style: createSentenceStyle({
            introDurationRatio: introDurationRatio,
            outroDurationRatio: outroDurationRatio,
        }),
        coord: {
            x: 0,
            y: 0,
        },
    };
}
