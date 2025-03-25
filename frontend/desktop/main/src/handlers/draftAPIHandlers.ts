import { DraftStorage } from "@/storages/draft";
import { DraftInfo, DraftUpdate } from "@desktop-common/draft";
import { ipcMain } from "electron";

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
        async (_, args: DraftUpdate.Args): Promise<DraftInfo> => {
            await draftStorage.updateDraft(args);
            return (await draftStorage.getDraft(args.id))!;
        }
    );

    ipcMain.handle("remove-draft", async (_, draftId: number) => {
        await draftStorage.removeDraft(draftId);
    });
}
