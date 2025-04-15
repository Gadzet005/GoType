import { ASSET_PROTOCOL_NAME } from "../consts";
import { AssetRef } from "@common/asset";
import { app } from "electron";
import jetpack from "fs-jetpack";
import path from "path";
import url from "url";
import { getExt } from "./path";

export class Asset {
    protected path: string;

    constructor(path: string) {
        this.path = path;
    }

    async exists() {
        return (await jetpack.existsAsync(this.path)) == "file";
    }

    getExt() {
        return getExt(this.path);
    }

    getRef(): AssetRef {
        const relative = path.relative(app.getPath("userData"), this.path);
        return {
            ext: this.getExt(),
            url: url
                .format({
                    pathname: relative,
                    protocol: ASSET_PROTOCOL_NAME + ":",
                    slashes: true,
                })
                .toString(),
        };
    }

    async getBuffer() {
        return (await jetpack.readAsync(this.path, "buffer")) ?? null;
    }

    async remove() {
        await jetpack.removeAsync(this.path);
    }
}

export async function copyAsset(
    dir: string,
    assetName: string,
    newAssetPath: string
): Promise<Asset> {
    const newFilePath = path.join(dir, assetName + path.extname(newAssetPath));
    await jetpack.copyAsync(newAssetPath, newFilePath);
    return new Asset(newFilePath);
}
