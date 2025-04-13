import { Asset } from "../../utils/asset";
import { LevelData } from "@common/level";
import { SentenceData } from "@common/level/sentence";
import path from "path";

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
    levelDir: string
): LevelData {
    const audio = new Asset(path.join(levelDir, "audio." + stored.audioExt));
    const background = new Asset(
        path.join(levelDir, "background." + stored.background.ext)
    );
    const preview = new Asset(
        path.join(levelDir, "preview." + stored.previewExt)
    );

    return {
        ...stored,
        preview: preview.getRef(),
        audio: audio.getRef(),
        background: {
            ...stored.background,
            asset: background.getRef(),
        },
    };
}
