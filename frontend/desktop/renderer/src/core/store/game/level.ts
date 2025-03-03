import { LevelData } from "@desktop-common/level";
import { TICK_TIME } from "./consts";
import { Language } from "@/core/utils/language";

/* 
    eslint-disable 
    @typescript-eslint/no-empty-object-type,
    @typescript-eslint/no-unsafe-declaration-merging
*/
export interface Level extends LevelData {}
export class Level implements LevelData {
    readonly language: Language;

    constructor(level: LevelData) {
        Object.assign(this, level);
        this.language =
            Language.byCode(this.languageCode) || Language.byCode("eng")!;
    }

    get durationInTicks(): number {
        return Math.ceil((this.duration * 1000) / TICK_TIME);
    }
}
/* eslint-enable */
