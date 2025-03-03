import {
    ASSET_PROTOCOL_NAME,
    LEVEL_DRAFTS_DIR_NAME,
    LEVELS_DIR_NAME,
} from "@/consts";
import path from "path";
import url from "url";

function getAssetUrl(
    baseDir: string,
    objId: number,
    name: string,
    type: string | null
): string | null {
    if (!type) {
        return null;
    }

    return url
        .format({
            pathname: path.join(baseDir, String(objId), name + "." + type),
            protocol: ASSET_PROTOCOL_NAME + ":",
            slashes: true,
        })
        .toString();
}

export function getLevelUrl(
    levelId: number,
    name: string,
    type: string | null
): string | null {
    return getAssetUrl(LEVELS_DIR_NAME, levelId, name, type);
}

export function getLevelDraftUrl(
    draftId: number,
    name: string,
    type: string | null
): string | null {
    return getAssetUrl(LEVEL_DRAFTS_DIR_NAME, draftId, name, type);
}
