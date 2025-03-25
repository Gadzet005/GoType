import { DraftAssetType, DraftUpdate } from "@desktop-common/draft";
import jetpack from "fs-jetpack";
import { FSJetpack } from "fs-jetpack/types";
import { defaultStoredDraftData, StoredDraftInfo } from "./storedDraftInfo";
import { logError } from "@/utils/common";
import { cache, Cached } from "../../utils/cache";
import path from "path";
import { StoredNamedAsset } from "./storedAsset";

type UpdateArgs = Omit<DraftUpdate.Args, "id">;

export class StoredDraft {
    static readonly DATA_FILE = "draft.json";
    private root: FSJetpack;

    constructor(path: string) {
        this.root = jetpack.dir(path);
    }

    @cache({ argsConverter: (obj) => obj.root.path() })
    async loadData(): Promise<StoredDraftInfo> {
        return await this.root
            .readAsync(StoredDraft.DATA_FILE, "json")
            .catch(logError("Failed to read draft data from file"));
    }

    async saveData(data: StoredDraftInfo) {
        (this.loadData as Cached).clearCache(this.root.path());
        await this.root
            .writeAsync(StoredDraft.DATA_FILE, data)
            .catch(logError("Failed to write draft data to file"));
    }

    private async updateAsset(
        type: DraftAssetType,
        newAssetPath: string | null
    ): Promise<StoredNamedAsset | null> {
        this.deleteAsset(type);
        if (!newAssetPath) {
            return null;
        }

        const fileName = path.basename(newAssetPath);
        await jetpack
            .copyAsync(newAssetPath, this.root.path(fileName))
            .catch(logError(`Failed to copy asset file: ${newAssetPath}`));

        const draftData = await this.loadData();
        await this.saveData(draftData);

        const splited = fileName.split(".");
        if (splited.length < 2) {
            throw Error(`Invalid file name: ${fileName}`);
        }
        return {
            name: splited.slice(0, splited.length - 1).join("."),
            ext: splited[splited.length - 1],
        };
    }

    private async deleteAsset(type: DraftAssetType) {
        const draftData = await this.loadData();
        if (!draftData[type]) {
            return;
        }

        const assetFileName = draftData[type].name + "." + draftData[type].ext;
        await this.root
            .removeAsync(assetFileName)
            .catch(logError(`Failed to remove asset file: ${assetFileName}`));
    }

    async isInited() {
        return this.root.existsAsync(StoredDraft.DATA_FILE);
    }

    async init(id: number): Promise<StoredDraftInfo> {
        const storedData = defaultStoredDraftData(id);
        await this.root
            .writeAsync(StoredDraft.DATA_FILE, storedData)
            .catch(logError("Failed to create draft info file"));
        return storedData;
    }

    async update(args: UpdateArgs) {
        const data = await this.loadData();

        if (args.name) {
            data.name = args.name;
        }
        if (args.sentences) {
            data.sentences = args.sentences;
        }
        if (args.styleClasses) {
            data.styleClasses = args.styleClasses;
        }
        if (args.newAudioFile !== undefined) {
            data.audio = await this.updateAsset("audio", args.newAudioFile);
        }
        if (args.newBackgroundFile !== undefined) {
            data.background = await this.updateAsset(
                "background",
                args.newBackgroundFile
            );
        }

        data.updateTime = Date.now();

        await this.saveData(data);
    }

    async remove() {
        await this.root
            .removeAsync()
            .catch(logError("Failed to delete draft directory"));
    }
}
