import { Draft } from "../store/draft";
import { DraftSentence } from "../store/draftSentence";

export function sentencesByText(draft: Draft, text: string) {
    return text
        .split("\n")
        .filter((line) => line !== "")
        .map(
            (line, i) =>
                new DraftSentence(draft.styleClasses, i, {
                    content: line,
                    coord: { x: 0, y: 0 },
                    showTime: null,
                    duration: null,
                    styleClassName: null,
                    rotation: 0,
                })
        );
}
