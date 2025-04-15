import React from "react";

export const DEFAULT_PATH = "";

export interface RouteNode {
    page: React.ElementType;
    forAuth?: boolean;
}

export interface RouteList {
    get(path: string): RouteNode | undefined;
    has(path: string): boolean;
}
