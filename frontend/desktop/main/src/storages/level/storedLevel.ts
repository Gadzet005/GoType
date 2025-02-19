import { AssetNames } from "@/consts";
import { getLevelAsset } from "@/utils/asset";
import { LevelInfo } from "@desktop-common/level";
import { Sentence } from "@desktop-common/level/sentence";
import { AssetTypes } from "@desktop-common/types";

export interface StoredLevel {
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
    previewType: AssetTypes.PictureType | null;
    backgroundType: AssetTypes.BackgroundType | null;
    audioType: AssetTypes.AudioType;
    sentences: Sentence[];
}

export function toStored(level: LevelInfo): StoredLevel {
    const previewType = level.preview ? level.preview.type : null;
    const backgroundType = level.game.background
        ? level.game.background.type
        : null;

    return {
        id: level.id,
        name: level.name,
        description: level.description,
        author: level.author,
        duration: level.duration,
        tags: level.tags,
        languageCode: level.languageCode,
        previewType: previewType,
        audioType: level.game.audio.type,
        backgroundType: backgroundType,
        sentences: level.game.sentences,
    };
}

export function fromStored(storedLevel: StoredLevel): LevelInfo {
    const audio = getLevelAsset<AssetTypes.AudioType>(
        storedLevel.id,
        AssetNames.AUDIO_FILENAME,
        storedLevel.audioType
    )!;
    const preview = getLevelAsset<AssetTypes.PictureType>(
        storedLevel.id,
        AssetNames.PREVIEW_FILENAME,
        storedLevel.previewType
    );
    const background = getLevelAsset<AssetTypes.BackgroundType>(
        storedLevel.id,
        AssetNames.BACKGROUND_FILENAME,
        storedLevel.backgroundType
    );

    return {
        id: storedLevel.id,
        name: storedLevel.name,
        description: storedLevel.description,
        author: storedLevel.author,
        duration: storedLevel.duration,
        tags: storedLevel.tags,
        languageCode: storedLevel.languageCode,
        preview: preview,
        game: {
            audio: audio,
            background: background,
            sentences: storedLevel.sentences,
        },
    };
}
