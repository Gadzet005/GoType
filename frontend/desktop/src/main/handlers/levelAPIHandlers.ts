import { LevelStorage } from "../storages/level";
import { ipcMain } from "electron";

export function initLevelAPIHandlers(levelStorage: LevelStorage) {
    ipcMain.handle("get-all-levels", async () => {
        return await levelStorage.getAllLevels();
    });

    ipcMain.handle("get-level", async (_, levelId: number) => {
        return await levelStorage.getLevel(levelId);
    });

    ipcMain.handle("remove-level", async (_, levelId: number) => {
        await levelStorage.removeLevel(levelId);
    });

    ipcMain.handle(
        "import-level",
        async (_, levelId: number, levelArchive: string) => {
            await levelStorage.importLevel(levelId, levelArchive);
        }
    );
}
