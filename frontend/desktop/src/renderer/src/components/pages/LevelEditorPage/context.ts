import React from "react";
import { Draft } from "./store/draft";
import { requireTrue } from "@/core/utils/panic";
import { AudioPlayer } from "react-use-audio-player";
import { DraftUpdateData } from "@common/draft";

export interface UpdateDraftOptions {
    quite?: boolean;
    newAudioFile?: string;
    newBackgroundFile?: string;
}

export type DraftUpdateParams = Omit<DraftUpdateData, "id">;

export interface EditorContextValue {
    draft: Draft;
    updateDraft: (params: DraftUpdateParams) => Promise<boolean>;
    saveDraft: (options?: UpdateDraftOptions) => Promise<void>;
    audioPlayer: AudioPlayer;
}

export const EditorContext = React.createContext<EditorContextValue | null>(
    null
);

export function useEditorContext(): EditorContextValue {
    const ctx = React.useContext(EditorContext);
    requireTrue(ctx !== null, "EditorContext is not available");
    return ctx!;
}
