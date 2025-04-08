import { LevelData } from "@desktop-common/level";
import { Language } from "@/core/utils/language";
import { requireTrue } from "@/core/utils/panic";

export class Level {
    private readonly info: LevelData;
    readonly language: Language;

    constructor(levelInfo: LevelData) {
        this.info = levelInfo;

        const lang = Language.byCode(levelInfo.languageCode);
        requireTrue(
            lang !== null,
            `Unknown language code=${levelInfo.languageCode}`
        );
        this.language = lang!;
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
