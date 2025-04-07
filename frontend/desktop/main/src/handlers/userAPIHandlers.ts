import { MainStorage } from "@/storages/main";
import { ipcMain } from "electron";
import { UserInfo } from "@desktop-common/user";

export function initUserAPIHandlers(mainStorage: MainStorage) {
    ipcMain.handle("get-user-info", async () => {
        return mainStorage.userInfo.get();
    });

    ipcMain.handle("save-user-info", async (_, userInfo: UserInfo) => {
        mainStorage.userInfo.save(userInfo);
    });

    ipcMain.handle("clear-user-info", async () => {
        mainStorage.userInfo.clear();
    });
}
