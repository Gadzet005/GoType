import { DraftData, DraftUpdateData, LevelCreationData } from "@common/draft";
import jetpack from "fs-jetpack";
import { FSJetpack } from "fs-jetpack/types";
import { defaultStoredDraftData, StoredDraftData } from "./storedDraftData";
import { logError } from "../../utils/common";
import { Asset, copyAsset } from "../../utils/asset";

type UpdateParams = Omit<DraftUpdateData, "id">;

export class StoredDraft {
    static readonly DATA_FILE = "draft.json";
    private root: FSJetpack;
    private data_: StoredDraftData | null = null;

    constructor(path: string) {
        this.root = jetpack.cwd(path);
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

    async getAudioAsset(): Promise<Asset | null> {
        const data = await this.loadData();
        if (data.audio === null) {
            return null;
        }
        const audioFileName = "audio." + data.audio;
        return new Asset(this.root.path(audioFileName));
    }

    async getBackgroundAsset(): Promise<Asset | null> {
        const data = await this.loadData();
        if (data.background.asset === null) {
            return null;
        }
        const backgroundFileName = "background." + data.background.asset;
        return new Asset(this.root.path(backgroundFileName));
    }

    async getPreviewAsset(): Promise<Asset | null> {
        const data = await this.loadData();
        if (!data.publication?.preview) {
            return null;
        }
        const previewFileName = "preview." + data.publication.preview;
        return new Asset(this.root.path(previewFileName));
    }

    async update(params: UpdateParams) {
        const { audioPath, background, publication, ...other } = params;
        const data = await this.loadData();

        if (audioPath) {
            const audioAsset = await this.getAudioAsset();
            await audioAsset?.remove();
            const newAsset = await copyAsset(
                this.root.path(),
                "audio",
                audioPath
            );
            data.audio = newAsset.getExt();
        }

        if (background) {
            const { path, ...other } = background;
            data.background = {
                ...data.background,
                ...other,
            };

            if (path) {
                const backgroundAsset = await this.getBackgroundAsset();
                await backgroundAsset?.remove();
                const newAsset = await copyAsset(
                    this.root.path(),
                    "background",
                    path
                );
                data.background.asset = newAsset.getExt();
            }
        }

        if (publication) {
            const { previewPath, ...other } = publication;
            data.publication = { ...data.publication, ...other };

            if (previewPath) {
                const previewAsset = await this.getPreviewAsset();
                await previewAsset?.remove();
                const newAsset = await copyAsset(
                    this.root.path(),
                    "preview",
                    previewPath
                );
                data.publication.preview = newAsset.getExt();
            }
        }

        await this.saveData({ ...data, ...other, updateTime: Date.now() });
    }

    async remove() {
        this.data_ = null;
        await this.root.removeAsync();
    }

    async getDraftData(): Promise<DraftData> {
        const data = await this.loadData();
        const audio = await this.getAudioAsset();
        const background = await this.getBackgroundAsset();
        const preview = await this.getPreviewAsset();

        return {
            ...data,
            audio: audio?.getRef() ?? null,
            background: {
                ...data.background,
                asset: background?.getRef() ?? null,
            },
            publication: data.publication && {
                ...data.publication,
                preview: preview?.getRef() ?? null,
            },
        };
    }

    path(): string {
        return this.root.path();
    }

    async getLevelCreationData(): Promise<LevelCreationData | null> {
        const isInited = await this.isInited();
        if (!isInited) {
            return null;
        }

        const data = await this.getDraftData();

        const audioBuffer = await this.getAudioAsset().then((audio) =>
            audio?.getBuffer()
        );
        const previewBuffer = await this.getPreviewAsset().then((preview) =>
            preview?.getBuffer()
        );
        const backgroundBuffer = await this.getBackgroundAsset().then(
            (background) => background?.getBuffer()
        );

        if (!audioBuffer || !previewBuffer || !backgroundBuffer) {
            return null;
        }

        return {
            draft: data,
            audio: audioBuffer.toString("base64"),
            preview: previewBuffer.toString("base64"),
            background: backgroundBuffer.toString("base64"),
        };
    }
}
