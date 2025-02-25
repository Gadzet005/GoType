import { DraftSentence } from "./sentence";
import { StyleClass } from "./style";
import { Asset, AssetTypes } from "../types";

export interface GeneralLevelDraftInfo {
    id: number;
    name: string;
    updateTime: number; // timestamp
}

export interface LevelDraftInfo extends GeneralLevelDraftInfo {
    audio: Asset<AssetTypes.AudioType> | null;
    background: Asset<AssetTypes.BackgroundType> | null;
    sentences: DraftSentence[];
    styleClasses: StyleClass[];
}
