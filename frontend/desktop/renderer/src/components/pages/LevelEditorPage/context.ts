import { DraftInfo } from "@desktop-common/draft";
import React from "react";
import { Draft } from "./draft";

export const EditorContext = React.createContext<Draft>(
    new Draft({} as DraftInfo)
);

export function useEditorContext() {
    return React.useContext(EditorContext);
}
