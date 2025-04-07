export const ASSET_PROTOCOL_NAME = "asset";
export const USER_DATA_DIR_NAME = "gotype";
export const LEVELS_DIR_NAME = "levels";
export const LEVEL_DRAFTS_DIR_NAME = "level-drafts";

export type AssetType = "audio" | "preview" | "background";

export function getDefaultDraftName(id: number) {
    return `Черновик ${id}`;
}
