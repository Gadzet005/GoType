import { DraftStorage } from "@/storages/draft";
import { DraftData, DraftUpdateData } from "@desktop-common/draft";
import { ipcMain, shell } from "electron";

export function initDraftAPIHandlers(draftStorage: DraftStorage) {
    ipcMain.handle("get-all-drafts", async () => {
        return await draftStorage.getAllDrafts();
    });

    ipcMain.handle("get-draft", async (_, draftId: number) => {
        return await draftStorage.getDraft(draftId);
    });

    ipcMain.handle("create-draft", async () => {
        return await draftStorage.createDraft();
    });

    ipcMain.handle(
        "update-draft",
        async (_, args: DraftUpdateData): Promise<DraftData> => {
            await draftStorage.updateDraft(args);
            const draft = await draftStorage.getDraft(args.id);
            return draft!;
        }
    );

    ipcMain.handle("remove-draft", async (_, draftId: number) => {
        await draftStorage.removeDraft(draftId);
    });

    ipcMain.handle("show-draft-dir", async (_, draftId: number) => {
        const stored = draftStorage.getStoredDraft(draftId);
        shell.openPath(stored.path());
    });
}
