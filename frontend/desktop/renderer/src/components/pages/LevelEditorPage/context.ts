import React from "react";
import { Draft } from "./draft";
import { requireTrue } from "@/core/utils/panic";

export interface EditorContextValue {
    draft: Draft;
    updateDraft: (quite?: boolean) => Promise<void>;
}

export const EditorContext = React.createContext<EditorContextValue | null>(
    null
);

export function useEditorContext(): EditorContextValue {
    const draft = React.useContext(EditorContext);
    requireTrue(draft !== null, "EditorContext is not available");
    return draft!;
}
