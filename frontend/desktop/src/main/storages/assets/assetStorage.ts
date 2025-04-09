import { ASSET_PROTOCOL_NAME } from "../../consts";
import { logError } from "../../utils/common";
import { getExt } from "../../utils/path";
import { Asset } from "@common/asset";
import { app } from "electron";
import jetpack from "fs-jetpack";
import { FSJetpack } from "fs-jetpack/types";
import path from "path";
import url from "url";

export class AssetStorage {
    readonly root: FSJetpack;
    readonly relativePath: string;

    constructor(rootPath: string) {
        this.root = jetpack.cwd(rootPath);
        this.relativePath = path.relative(app.getPath("userData"), rootPath);
    }

    async has(name: string) {
        return await this.root.existsAsync(name);
    }

    get(name: string): Asset {
        return {
            ext: getExt(name),
            url: url
                .format({
                    pathname: path.join(this.relativePath, name),
                    protocol: ASSET_PROTOCOL_NAME + ":",
                    slashes: true,
                })
                .toString(),
        };
    }

    async save(name: string, newAssetPath: string) {
        await jetpack
            .copyAsync(newAssetPath, this.root.path(name))
            .catch(
                logError(
                    `Failed to copy asset file: ${name} (from: ${newAssetPath})`
                )
            );
    }

    async remove(name: string) {
        await this.root
            .removeAsync(name)
            .catch(logError(`Failed to remove asset file: ${name}`));
    }
}
