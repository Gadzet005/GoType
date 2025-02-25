import { FileSystemStorage } from "../base/FileSystemStorage";
import { LevelDraftInfo } from "@desktop-common/draft";
import { logError } from "@/utils/common";
import { getDefaultDraftName } from "@/consts";

export class LevelDraftStorage extends FileSystemStorage {
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

    private getDefaultDraft(id: number): LevelDraftInfo {
        return {
            id: id,
            styleClasses: [],
            sentences: [],
            background: null,
            audio: null,
            name: getDefaultDraftName(id),
            updateTime: Date.now(),
        };
    }

    async createDraft(): Promise<LevelDraftInfo> {
        const draftId = this.getNewId();
        const draftDir = this.root.dir(String(draftId));
        const draft = this.getDefaultDraft(draftId);

        await draftDir
            .writeAsync(LevelDraftStorage.INFO_FILE_NAME, draft)
            .catch(logError("Failed to create draft info file"));

        this.mainStorage.savedLevelDrafts.add(draftId);

        return draft;
    }

    async getAllDrafts(): Promise<LevelDraftInfo[]> {
        const draftIds = this.mainStorage.savedLevelDrafts.getAll();
        const drafts = await Promise.all(
            draftIds.map(async (draftId) => {
                const draft = await this.getDraft(draftId);
                return draft;
            })
        );
        return drafts.filter(
            (draft): draft is LevelDraftInfo => draft !== null
        );
    }

    async getDraft(draftId: number): Promise<LevelDraftInfo | null> {
        const draftDir = this.root.dir(String(draftId));

        const draft: LevelDraftInfo = await draftDir
            .readAsync(LevelDraftStorage.INFO_FILE_NAME, "json")
            .catch(logError("Failed to read draft info from file"));

        return draft;
    }

    async updateDraft(draft: LevelDraftInfo) {
        const draftDir = this.root.dir(String(draft.id));
        draft.updateTime = Date.now();

        await draftDir
            .writeAsync(LevelDraftStorage.INFO_FILE_NAME, draft)
            .catch(logError("Failed to update draft info file"));
    }

    async removeDraft(draftId: number) {
        const draftDir = this.root.dir(String(draftId));

        this.mainStorage.savedLevelDrafts.remove(draftId);
        await draftDir
            .removeAsync()
            .catch(
                logError(
                    `Failed to remove draft directory. draftId = ${draftId}`
                )
            );
    }
}
