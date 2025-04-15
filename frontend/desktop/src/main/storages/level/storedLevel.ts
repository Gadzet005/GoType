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
    difficulty: number;
    background: {
        ext: string;
        brightness: number;
    };
    audioExt: string;
    sentences: SentenceData[];
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
