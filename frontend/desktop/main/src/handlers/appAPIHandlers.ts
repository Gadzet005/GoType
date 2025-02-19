import { app, ipcMain } from "electron";

export function initAppAPIHandlers() {
    ipcMain.handle("quit-app", async () => {
        app.quit();
    });
}
