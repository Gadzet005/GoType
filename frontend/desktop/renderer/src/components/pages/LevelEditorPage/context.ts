import React from "react";
import { Draft } from "./draft";
import { requireTrue } from "@/core/utils/panic";

export const EditorContext = React.createContext<Draft | null>(null);

export function useEditorContext(): Draft {
    const draft = React.useContext(EditorContext);
    requireTrue(draft !== null, "EditorContext is not available");
    return draft!;
}
