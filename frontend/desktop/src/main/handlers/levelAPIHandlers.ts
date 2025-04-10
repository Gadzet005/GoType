import { LevelStorage } from "../storages/level";
import { LevelData } from "@common/level";
import { ipcMain } from "electron";

export function initLevelAPIHandlers(levelStorage: LevelStorage) {
    ipcMain.handle("get-all-levels", async () => {
        return await levelStorage.getAllLevels();
    });

    ipcMain.handle("get-level", async (_, levelId: number) => {
        return await levelStorage.getLevel(levelId);
    });

    ipcMain.handle("save-level", async (_, level: LevelData) => {
        await levelStorage.saveLevel(level);
    });

    ipcMain.handle("remove-level", async (_, levelId: number) => {
        await levelStorage.removeLevel(levelId);
    });
}
