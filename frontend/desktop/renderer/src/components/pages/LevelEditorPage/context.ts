import React from "react";
import { Draft } from "./store/draft";
import { requireTrue } from "@/core/utils/panic";
import { AudioPlayer } from "react-use-audio-player";

export interface UpdateDraftOptions {
    quite?: boolean;
    newAudioFile?: string;
    newBackgroundFile?: string;
}

export interface EditorContextValue {
    draft: Draft;
    updateDraft: (options?: UpdateDraftOptions) => Promise<void>;
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
