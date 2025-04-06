import React from "react";
import { Draft } from "./store/draft";
import { requireTrue } from "@/core/utils/panic";

export interface UpdateDraftOptions {
    quite?: boolean;
    newAudioFile?: string | null;
    newBackgroundFile?: string | null;
}

export interface EditorContextValue {
    draft: Draft;
    updateDraft: (options?: UpdateDraftOptions) => Promise<void>;
}

export const EditorContext = React.createContext<EditorContextValue | null>(
    null
);

export function useEditorContext(): EditorContextValue {
    const draft = React.useContext(EditorContext);
    requireTrue(draft !== null, "EditorContext is not available");
    return draft!;
}
