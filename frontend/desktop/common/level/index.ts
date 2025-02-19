import { Sentence } from "./sentence";
import { Asset, second, AssetTypes } from "../types";

export interface GeneralLevelInfo {
    id: number;
    name: string;
    description: string;
    author: {
        id: number;
        name: string;
    };
    duration: second;
    tags: string[];
    languageCode: string;
    preview: Asset<AssetTypes.PictureType> | null;
}

export interface GameLevelInfo {
    audio: Asset<AssetTypes.AudioType>;
    background: Asset<AssetTypes.BackgroundType> | null;
    sentences: Sentence[];
}

export interface LevelInfo extends GeneralLevelInfo {
    game: GameLevelInfo;
}
