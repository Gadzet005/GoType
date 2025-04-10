import { FileSystemStorage } from "../base/FileSystemStorage";
import { DraftData, DraftUpdateData } from "@common/draft";
import { StoredDraft } from "./storedDraft";
import { logError } from "../../utils/common";

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

    getStoredDraft(draftId: number): StoredDraft {
        return new StoredDraft(this.root.path(String(draftId)));
    }

    async createDraft(): Promise<DraftData> {
        const id = this.getNewId();
        const stored = this.getStoredDraft(id);
        await stored.init(id);

        this.mainStorage.savedLevelDrafts.add(id);

        return stored.getDraftData();
    }

    async getDraft(draftId: number): Promise<DraftData | null> {
        const stored = this.getStoredDraft(draftId);
        const isInited = await stored.isInited();
        if (!isInited) {
            return null;
        }
        return stored.getDraftData();
    }

    async getAllDrafts(): Promise<DraftData[]> {
        const draftIds = this.mainStorage.savedLevelDrafts.getAll();
        const drafts = await Promise.all(
            draftIds.map(async (draftId) => {
                const draft = await this.getDraft(draftId);
                return draft;
            })
        ).catch(logError("Failed to get all drafts"));
        return drafts.filter((draft): draft is DraftData => draft !== null);
    }

    async updateDraft(updateData: DraftUpdateData) {
        const stored = this.getStoredDraft(updateData.id);
        await stored.update(updateData);
    }

    async removeDraft(draftId: number) {
        const stored = this.getStoredDraft(draftId);
        await stored.remove();
        this.mainStorage.savedLevelDrafts.remove(draftId);
    }
}
