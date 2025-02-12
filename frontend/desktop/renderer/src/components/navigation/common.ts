import React from "react";

export const DEFAULT_PATH = "";

export interface RouteList {
    get(path: string): React.ElementType | undefined;
}
