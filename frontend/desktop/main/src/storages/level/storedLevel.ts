import { AssetType } from "@/consts";
import { getLevelUrl } from "@/utils/url";
import { Asset } from "@desktop-common/asset";
import { LevelData } from "@desktop-common/level";
import { Sentence } from "@desktop-common/level/sentence";

export interface StoredLevelData {
    id: number;
    name: string;
    description: string;
    author: {
        id: number;
        name: string;
    };
    duration: number;
    tags: string[];
    languageCode: string;
    previewExt: string;
    backgroundExt: string;
    audioExt: string;
    sentences: Sentence[];
}

function fromStoredAsset(levelId: number, type: AssetType, ext: string): Asset {
    return {
        ext: ext,
        url: getLevelUrl(levelId, type, ext) ?? "",
    };
}

export function toStored(level: LevelData): StoredLevelData {
    return {
        id: level.id,
        name: level.name,
        description: level.description,
        author: level.author,
        duration: level.duration,
        tags: level.tags,
        languageCode: level.languageCode,
        previewExt: level.preview.ext,
        audioExt: level.game.audio.ext,
        backgroundExt: level.game.background.ext,
        sentences: level.game.sentences,
    };
}

export function fromStored(stored: StoredLevelData): LevelData {
    return {
        id: stored.id,
        name: stored.name,
        description: stored.description,
        author: stored.author,
        duration: stored.duration,
        tags: stored.tags,
        languageCode: stored.languageCode,
        preview: fromStoredAsset(stored.id, "preview", stored.previewExt),
        game: {
            audio: fromStoredAsset(stored.id, "preview", stored.audioExt),
            background: fromStoredAsset(
                stored.id,
                "background",
                stored.backgroundExt
            ),
            sentences: stored.sentences,
        },
    };
}
