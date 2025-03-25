import { DraftInfo } from "@desktop-common/draft";
import {
    namedAssetFromStored,
    namedAssetToStored,
    StoredNamedAsset,
} from "./storedAsset";
import { getDefaultDraftName } from "@/consts";

type DraftDataWithoutAssets = Omit<DraftInfo, "audio" | "background">;

export interface StoredDraftInfo extends DraftDataWithoutAssets {
    audio: StoredNamedAsset | null;
    background: StoredNamedAsset | null;
}

export function toStored(draft: DraftInfo): StoredDraftInfo {
    return {
        id: draft.id,
        name: draft.name,
        audio: namedAssetToStored(draft.audio),
        background: namedAssetToStored(draft.background),
        sentences: draft.sentences,
        styleClasses: draft.styleClasses,
        updateTime: draft.updateTime,
    };
}

export function fromStored(storedDraft: StoredDraftInfo): DraftInfo {
    return {
        id: storedDraft.id,
        name: storedDraft.name,
        audio: namedAssetFromStored(storedDraft.audio, storedDraft.id),
        background: namedAssetFromStored(
            storedDraft.background,
            storedDraft.id
        ),
        sentences: storedDraft.sentences,
        styleClasses: storedDraft.styleClasses,
        updateTime: storedDraft.updateTime,
    };
}

export function defaultStoredDraftData(id: number): StoredDraftInfo {
    return {
        id,
        styleClasses: [],
        sentences: [],
        background: null,
        audio: null,
        name: getDefaultDraftName(id),
        updateTime: Date.now(),
    };
}
