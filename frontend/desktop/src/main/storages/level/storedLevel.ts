import { LevelData } from "@common/level";
import { SentenceData } from "@common/level/sentence";
import { AssetStorage } from "../assets/assetStorage";

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
    background: {
        ext: string;
        brightness: number;
    };
    audioExt: string;
    sentences: SentenceData[];
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
        audioExt: level.audio.ext,
        background: {
            ext: level.background.asset.ext,
            brightness: level.background.brightness,
        },
        sentences: level.sentences,
    };
}

export function fromStored(
    stored: StoredLevelData,
    assets: AssetStorage
): LevelData {
    return {
        ...stored,
        preview: assets.get("preview" + "." + stored.previewExt),
        audio: assets.get("audio" + "." + stored.audioExt),
        background: {
            ...stored.background,
            asset: assets.get("background" + "." + stored.background.ext),
        },
    };
}
