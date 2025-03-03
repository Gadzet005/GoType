import { getLevelDraftUrl } from "@/utils/url";
import { NamedAsset } from "@desktop-common/asset";

export type StoredNamedAsset = Omit<NamedAsset, "url">;

export function namedAssetToStored(
    asset: NamedAsset | null
): StoredNamedAsset | null {
    if (asset == null) {
        return null;
    }
    return {
        name: asset.name,
        ext: asset.ext,
    };
}

export function namedAssetFromStored(
    storedAsset: StoredNamedAsset | null,
    draftId: number
): NamedAsset | null {
    if (storedAsset == null) {
        return null;
    }
    return {
        name: storedAsset.name,
        ext: storedAsset.ext,
        url: getLevelDraftUrl(draftId, storedAsset.name, storedAsset.ext) ?? "",
    };
}
