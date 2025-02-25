import { LevelDraftStorage } from "@/storages/levelDraft";
import { LevelDraftInfo } from "@desktop-common/draft";
import { ipcMain } from "electron";

export function initLevelDraftAPIHandlers(draftStorage: LevelDraftStorage) {
    ipcMain.handle("get-all-drafts", async () => {
        return await draftStorage.getAllDrafts();
    });

    ipcMain.handle("get-draft", async (_, draftId: number) => {
        return await draftStorage.getDraft(draftId);
    });

    ipcMain.handle("create-draft", async () => {
        return await draftStorage.createDraft();
    });

    ipcMain.handle("update-draft", async (_, draft: LevelDraftInfo) => {
        await draftStorage.updateDraft(draft);
    });

    ipcMain.handle("remove-draft", async (_, draftId: number) => {
        await draftStorage.removeDraft(draftId);
    });
}
