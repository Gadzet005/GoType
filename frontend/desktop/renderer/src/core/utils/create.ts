import { SentenceStyle } from "@desktop-common/level/style";
import deepmerge from "deepmerge";
import { Defaults } from "../config/game.config";

export function createSentenceStyle(
    options: Partial<SentenceStyle>
): SentenceStyle {
    return deepmerge(Defaults.sentenceStyle, options);
}
