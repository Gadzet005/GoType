import { LevelInfo } from "@desktop-common/level";
import { TICK_TIME } from "./consts";
import { Language } from "@/core/utils/language";

/* 
    eslint-disable 
    @typescript-eslint/no-empty-object-type,
    @typescript-eslint/no-unsafe-declaration-merging
*/
export interface Level extends LevelInfo {}
export class Level implements LevelInfo {
    readonly language: Language;

    constructor(level: LevelInfo) {
        Object.assign(this, level);
        this.language =
            Language.byCode(this.languageCode) || Language.byCode("eng")!;
    }

    get durationInTicks(): number {
        return Math.ceil((this.duration * 1000) / TICK_TIME);
    }
}
/* eslint-enable */
