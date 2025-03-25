import { FileSystemStorage } from "../base/FileSystemStorage";
import { DraftInfo, DraftUpdate } from "@desktop-common/draft";
import { fromStored } from "./storedDraftInfo";
import { StoredDraft } from "./storedDraft";
import { logError } from "@/utils/common";

export class DraftStorage extends FileSystemStorage {
    static readonly INFO_FILE_NAME = "draft.json";
    private idCounter: number | null = null;

    private getNewId(): number {
        if (this.idCounter === null) {
            const ids = this.mainStorage.savedLevelDrafts.getAll();
            this.idCounter = ids.length === 0 ? 0 : Math.max(...ids);
        }
        this.idCounter++;
        return this.idCounter;
    }

    private getStoredDraft(draftId: number): StoredDraft {
        return new StoredDraft(this.root.path(String(draftId)));
    }

    async createDraft(): Promise<DraftInfo> {
        const id = this.getNewId();
        const stored = this.getStoredDraft(id);
        const storedData = await stored.init(id);

        this.mainStorage.savedLevelDrafts.add(id);

        return fromStored(storedData);
    }

    async getDraft(draftId: number): Promise<DraftInfo | null> {
        const stored = this.getStoredDraft(draftId);
        const isInited = await stored.isInited();
        if (!isInited) {
            return null;
        }
        return fromStored(await stored.loadData());
    }

    async getAllDrafts(): Promise<DraftInfo[]> {
        const draftIds = this.mainStorage.savedLevelDrafts.getAll();
        const drafts = await Promise.all(
            draftIds.map(async (draftId) => {
                const draft = await this.getDraft(draftId);
                return draft;
            })
        ).catch(logError("Failed to get all drafts"));
        return drafts.filter((draft): draft is DraftInfo => draft !== null);
    }

    async updateDraft(args: DraftUpdate.Args) {
        const stored = this.getStoredDraft(args.id);
        await stored.update(args);
    }

    async removeDraft(draftId: number) {
        const stored = this.getStoredDraft(draftId);
        await stored.remove();
        this.mainStorage.savedLevelDrafts.remove(draftId);
    }
}
