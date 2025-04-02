import { AssetType } from "@/consts";
import { getLevelUrl } from "@/utils/url";
import { Asset } from "@desktop-common/asset";
import { LevelInfo } from "@desktop-common/level";
import { StyledSentenceInfo } from "@desktop-common/level/sentence";

export interface StoredLevelInfo {
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
    background: {
        ext: string;
        brightness: number;
    };
    audioExt: string;
    sentences: StyledSentenceInfo[];
}

function fromStoredAsset(levelId: number, type: AssetType, ext: string): Asset {
    return {
        ext: ext,
        url: getLevelUrl(levelId, type, ext) ?? "",
    };
}

export function toStored(level: LevelInfo): StoredLevelInfo {
    return {
        id: level.id,
        name: level.name,
        description: level.description,
        author: level.author,
        duration: level.duration,
        tags: level.tags,
        languageCode: level.languageCode,
        previewExt: level.preview.ext,
        audioExt: level.audio.ext,
        background: {
            ext: level.background.asset.ext,
            brightness: level.background.brightness,
        },
        sentences: level.sentences,
    };
}

export function fromStored(stored: StoredLevelInfo): LevelInfo {
    return {
        id: stored.id,
        name: stored.name,
        description: stored.description,
        author: stored.author,
        duration: stored.duration,
        tags: stored.tags,
        languageCode: stored.languageCode,
        preview: fromStoredAsset(stored.id, "preview", stored.previewExt),
        audio: fromStoredAsset(stored.id, "audio", stored.audioExt),
        background: {
            asset: fromStoredAsset(
                stored.id,
                "background",
                stored.background.ext
            ),
            brightness: stored.background.brightness,
        },
        sentences: stored.sentences,
    };
}
