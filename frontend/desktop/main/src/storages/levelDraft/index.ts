import path from "path";
import { FileSystemStorage } from "../base/FileSystemStorage";
import { LevelDraftInfo, LevelDraftInitialInfo } from "@desktop-common/draft";
import fs from "fs/promises";
import { ignoreCode, logError } from "@/utils/common";

export class LevelDraftStorage extends FileSystemStorage {
    private idCounter: number | null = null;

    private getDraftPath(id: number): string {
        return path.join(this.dir, String(id));
    }

    private getNewId(): number {
        if (this.idCounter === null) {
            const ids = this.mainStorage.savedLevelDrafts.getAll();
            this.idCounter = Math.max(...ids);
        }
        this.idCounter++;
        return this.idCounter;
    }

    async createDraft(initial: LevelDraftInitialInfo): Promise<LevelDraftInfo> {
        const draftId = this.getNewId();
        const draftPath = this.getDraftPath(draftId);

        await fs
            .mkdir(draftPath, { recursive: true })
            .catch(ignoreCode("EEXIST"))
            .catch(logError("Failed to create draft directory"));

        const draft: LevelDraftInfo = {
            id: draftId,
            sentences: [],
            styleClasses: [],
            background: null,
            updateTime: Date.now(),
            ...initial,
        };

        await fs
            .writeFile(
                path.join(draftPath, "draft.json"),
                JSON.stringify(draft, null, 2)
            )
            .catch(logError("Failed to write draft info to file"));

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
        const draftPath = this.getDraftPath(draftId);
        const draftJson = await fs
            .readFile(path.join(draftPath, "draft.json"), "utf8")
            .catch((err) => {
                ignoreCode("ENOENT")(err);
                return null;
            })
            .catch(logError("Failed to read draft info from file"));

        if (!draftJson) {
            return null;
        }

        const draft = JSON.parse(draftJson) as LevelDraftInfo;
        return draft;
    }

    async updateDraft(draft: LevelDraftInfo) {
        const draftPath = this.getDraftPath(draft.id);
        draft.updateTime = Date.now();
        await fs
            .writeFile(
                path.join(draftPath, "draft.json"),
                JSON.stringify(draft, null, 2)
            )
            .catch(logError("Failed to write draft info to file"));
    }

    async removeDraft(draftId: number) {
        const draftPath = this.getDraftPath(draftId);
        await fs
            .rm(draftPath, { recursive: true })
            .catch(logError("Failed to delete draft directory"));
        this.mainStorage.savedLevelDrafts.remove(draftId);
    }
}
