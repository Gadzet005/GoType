import { LevelData } from "@desktop-common/level";
import { Language } from "@/core/utils/language";
import { requireTrue } from "@/core/utils/panic";

export class Level {
    private readonly data: LevelData;
    readonly language: Language;

    constructor(levelData: LevelData) {
        this.data = levelData;

        const lang = Language.byCode(levelData.languageCode);
        requireTrue(
            lang !== null,
            `Unknown language code=${levelData.languageCode}`
        );
        this.language = lang!;
    }

    get id() {
        return this.data.id;
    }

    get name() {
        return this.data.name;
    }

    get description() {
        return this.data.description;
    }

    get author() {
        return this.data.author;
    }

    get duration() {
        return this.data.duration;
    }

    get tags() {
        return this.data.tags;
    }

    get preview() {
        return this.data.preview;
    }

    get audio() {
        return this.data.audio;
    }

    get background() {
        return this.data.background;
    }

    get sentences() {
        return this.data.sentences;
    }
}
