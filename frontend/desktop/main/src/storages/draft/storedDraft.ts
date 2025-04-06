import { DraftData, DraftUpdateData } from "@desktop-common/draft";
import jetpack from "fs-jetpack";
import { FSJetpack } from "fs-jetpack/types";
import { defaultStoredDraftData, StoredDraftData } from "./storedDraftData";
import { logError } from "@/utils/common";
import path from "path";
import { AssetStorage } from "../assets/assetStorage";
import { AssetType } from "@/consts";
import { getExt } from "@/utils/path";

type UpdateParams = Omit<DraftUpdateData, "id">;

export class StoredDraft {
    static readonly DATA_FILE = "draft.json";
    private root: FSJetpack;
    private data_: StoredDraftData | null = null;
    private assets: AssetStorage;

    constructor(path: string) {
        this.root = jetpack.cwd(path);
        this.assets = new AssetStorage(path);
    }

    async loadData(): Promise<StoredDraftData> {
        if (!this.data_) {
            this.data_ = await this.root
                .readAsync(StoredDraft.DATA_FILE, "json")
                .catch(logError("Failed to read draft data from file"));
        }
        return this.data_!;
    }

    async saveData(data: StoredDraftData) {
        this.data_ = data;
        await this.root
            .writeAsync(StoredDraft.DATA_FILE, data)
            .catch(logError("Failed to write draft data to file"));
    }

    async isInited() {
        return this.root.existsAsync(StoredDraft.DATA_FILE);
    }

    async init(id: number) {
        await this.saveData(defaultStoredDraftData(id));
    }

    private async updateAsset(
        type: AssetType,
        newAssetPath: string,
        old: string | null
    ): Promise<string> {
        if (old) {
            await this.assets.remove(type + "." + old);
        }

        const ext = getExt(newAssetPath);
        await this.assets.save(type + "." + ext, newAssetPath);

        return ext;
    }

    async update(params: UpdateParams) {
        const { audioPath, background, publication, ...other } = params;
        const data = await this.loadData();

        if (audioPath) {
            data.audio = await this.updateAsset("audio", audioPath, data.audio);
        }

        if (background) {
            const { path, ...other } = background;
            data.background = {
                ...data.background,
                ...other,
            };

            if (path) {
                data.background.asset = await this.updateAsset(
                    "background",
                    path,
                    data.background.asset
                );
            }
        }

        if (publication) {
            const { previewPath, ...other } = publication;
            data.publication = { preview: null, ...data.publication, ...other };

            if (previewPath) {
                data.publication.preview = await this.updateAsset(
                    "preview",
                    previewPath,
                    data.publication.preview
                );
            }
        }

        await this.saveData({ ...data, ...other, updateTime: Date.now() });
    }

    async remove() {
        this.data_ = null;
        await this.root
            .removeAsync()
            .catch(logError("Failed to delete draft directory"));
    }

    async getDraftData(): Promise<DraftData> {
        const data = await this.loadData();

        const getAsset = (type: AssetType, ext: string | null) => {
            const name = ext === null ? null : type + "." + ext;
            return name === null ? null : this.assets.get(name);
        };

        return {
            ...data,
            audio: getAsset("audio", data.audio),
            background: {
                ...data.background,
                asset: getAsset("background", data.background.asset),
            },
            publication: data.publication && {
                ...data.publication,
                preview: getAsset("preview", data.publication.preview),
            },
        };
    }

    path(): string {
        return this.root.path();
    }
}
