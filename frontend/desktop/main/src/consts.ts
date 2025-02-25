export const ASSET_PROTOCOL_NAME = "asset";
export const USER_DATA_DIR_NAME = "gotype";
export const LEVELS_DIR_NAME = "levels";
export const LEVEL_DRAFTS_DIR_NAME = "level-drafts";
export const MAIN_STORAGE_FILE_NAME = "config.json";

export namespace AssetNames {
    export const PREVIEW_FILENAME = "preview";
    export const AUDIO_FILENAME = "audio";
    export const BACKGROUND_FILENAME = "background";
}

export function getDefaultDraftName(id: number) {
    return `Черновик ${id}`;
}
