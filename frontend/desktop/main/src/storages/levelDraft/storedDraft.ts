import { AssetNames } from "@/consts";
import { LevelDraftInfo } from "@desktop-common/draft";
import { AssetTypes } from "@desktop-common/types";
import { getLevelDraftAsset } from "@/utils/asset";

export interface StoredDraft
    extends Omit<LevelDraftInfo, "audio" | "background"> {
    audioType: AssetTypes.AudioType;
    backgroundType: AssetTypes.BackgroundType | null;
}

export function toStored(draft: LevelDraftInfo): StoredDraft {
    const backgroundType = draft.background ? draft.background.type : null;
    return {
        id: draft.id,
        name: draft.name,
        audioType: draft.audio.type,
        backgroundType: backgroundType,
        sentences: draft.sentences,
        styleClasses: draft.styleClasses,
        updateTime: draft.updateTime,
    };
}

export function fromStored(storedDraft: StoredDraft): LevelDraftInfo {
    const audio = getLevelDraftAsset<AssetTypes.AudioType>(
        storedDraft.id,
        AssetNames.AUDIO_FILENAME,
        storedDraft.audioType
    )!;
    const background = getLevelDraftAsset<AssetTypes.BackgroundType>(
        storedDraft.id,
        AssetNames.BACKGROUND_FILENAME,
        storedDraft.backgroundType
    );

    return {
        id: storedDraft.id,
        name: storedDraft.name,
        audio: audio,
        background: background,
        sentences: storedDraft.sentences,
        styleClasses: storedDraft.styleClasses,
        updateTime: storedDraft.updateTime,
    };
}
