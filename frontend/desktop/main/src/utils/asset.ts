import {
    ASSET_PROTOCOL_NAME,
    LEVEL_DRAFTS_DIR_NAME,
    LEVELS_DIR_NAME,
} from "@/consts";
import { Asset } from "@desktop-common/types";
import path from "path";
import url from "url";

function getAsset<T>(
    baseDir: string,
    objId: number,
    name: string,
    type: string | null
): Asset<T> | null {
    if (!type) {
        return null;
    }

    return {
        type: type as T,
        url: url
            .format({
                pathname: path.join(baseDir, String(objId), name + "." + type),
                protocol: ASSET_PROTOCOL_NAME + ":",
                slashes: true,
            })
            .toString(),
    };
}

export function getLevelAsset<T>(
    levelId: number,
    name: string,
    type: string | null
): Asset<T> | null {
    return getAsset(LEVELS_DIR_NAME, levelId, name, type);
}

export function getLevelDraftAsset<T>(
    draftId: number,
    name: string,
    type: string | null
): Asset<T> | null {
    return getAsset(LEVEL_DRAFTS_DIR_NAME, draftId, name, type);
}
