import { LevelInfo } from "@desktop-common/level";
import { TICK_TIME } from "@/core/config/game.config";
import { Language } from "@/core/utils/language";

export class Level {
    private readonly info: LevelInfo;
    readonly language: Language;

    constructor(levelData: LevelInfo) {
        this.info = levelData;
        this.language =
            Language.byCode(levelData.languageCode) ?? Language.default();
    }

    get id() {
        return this.info.id;
    }

    get name() {
        return this.info.name;
    }

    get description() {
        return this.info.description;
    }

    get author() {
        return this.info.author;
    }

    get duration() {
        return this.info.duration;
    }

    get durationInMilliseconds() {
        return this.info.duration * TICK_TIME;
    }

    get tags() {
        return this.info.tags;
    }

    get preview() {
        return this.info.preview;
    }

    get audio() {
        return this.info.audio;
    }

    get background() {
        return this.info.background;
    }

    get sentences() {
        return this.info.sentences;
    }
}
