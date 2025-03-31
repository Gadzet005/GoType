import { Defaults } from "@/core/config/game.config";
import { SentenceInfo } from "@desktop-common/level/sentence";

export function createDummySentence(
    text: string,
    showTime = 1000,
    duration = 1000,
    introDuration = 10,
    outroDuration = 10
): SentenceInfo {
    return {
        content: text,
        showTime: showTime,
        duration: duration,
        introDuration: introDuration,
        outroDuration: outroDuration,
        style: Defaults.sentenceStyle,
        coord: {
            x: 0,
            y: 0,
        },
    };
}
