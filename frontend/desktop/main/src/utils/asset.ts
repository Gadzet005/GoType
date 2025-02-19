import { ProtocolNames } from "@/consts";
import { Asset } from "@desktop-common/types";
import path from "path";
import url from "url";

function getAsset<T>(
    objId: number,
    name: string,
    type: string | null,
    protocolName: string
): Asset<T> | null {
    if (!type) {
        return null;
    }

    return {
        type: type as T,
        url: url
            .format({
                pathname: path.join(String(objId), name + "." + type),
                protocol: protocolName + ":",
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
    return getAsset(levelId, name, type, ProtocolNames.LEVEL_ASSET);
}

export function getLevelDraftAsset<T>(
    draftId: number,
    name: string,
    type: string | null
): Asset<T> | null {
    return getAsset(draftId, name, type, ProtocolNames.LEVEL_DRAFT_ASSET);
}
