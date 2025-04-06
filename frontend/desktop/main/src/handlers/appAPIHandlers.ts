import { app, dialog, ipcMain } from "electron";
import { FileMeta } from "@desktop-common/file";
import jetpack from "fs-jetpack";
import path from "path";
import { getExt } from "@/utils/path";

export function initAppAPIHandlers() {
    ipcMain.handle("quit-app", async () => {
        app.quit();
    });

    ipcMain.handle(
        "openFileDialog",
        async (_: any, extensions: string[] = []) => {
            const result = await dialog.showOpenDialog({
                properties: ["openFile"],
                filters: [{ name: "filter", extensions: extensions ?? [] }],
            });

            const fileStats = await Promise.all(
                result.filePaths.map((filePath) =>
                    jetpack.inspectAsync(filePath)
                )
            );

            const rawFileInfoList: (FileMeta | null)[] = fileStats.map(
                (stat, index) => {
                    if (!stat) {
                        return null;
                    }
                    const absPath = result.filePaths[index];

                    return {
                        path: absPath,
                        name: path.basename(absPath),
                        ext: getExt(absPath),
                        size: stat.size,
                    };
                }
            );

            return rawFileInfoList.filter((item) => item !== null);
        }
    );
}
