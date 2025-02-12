import { app, BrowserWindow, ipcMain, net, protocol } from "electron";
import path from "path";
import url from "url";
import { AppStore } from "./store";
import { LevelStore } from "./levelStore";
import { Level } from "../../common/level";
import {
    installExtension,
    REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

const isDev = process.env.ELECTRON_IS_DEV || false;

function createWindow(): BrowserWindow {
    let mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js"),
        },
        autoHideMenuBar: true,
        frame: false,
    });

    const startUrl = isDev
        ? process.env.ELECTRON_START_URL || ""
        : url
              .pathToFileURL(path.join(__dirname, "../dist/index.html"))
              .toString();

    mainWindow.maximize();
    mainWindow.loadURL(startUrl);
    return mainWindow;
}

function createStore(): { mainStore: AppStore; levelStore: LevelStore } {
    let mainStore = new AppStore();
    let levelStore = new LevelStore(
        path.join(app.getPath("userData"), "levels")
    );

    ipcMain.handle("get-tokens", async () => {
        return mainStore.getTokens();
    });
    ipcMain.handle(
        "store-tokens",
        async (_, accessToken: any, refreshToken: any) => {
            mainStore.storeTokens(accessToken, refreshToken);
        }
    );
    ipcMain.handle("clear-tokens", async () => {
        mainStore.clearTokens();
    });

    ipcMain.handle("get-levels", async () => {
        const levelIds = mainStore.getSavedLevels();

        const awaitedLevels: Promise<Level | null>[] = [];
        for (const levelId of levelIds) {
            awaitedLevels.push(levelStore.getLevel(levelId));
        }

        const levels: Level[] = [];
        for (const awaitedLevel of awaitedLevels) {
            const level = await awaitedLevel;
            if (level) {
                levels.push(level);
            }
        }

        return levels;
    });

    ipcMain.handle("get-level", async (_, levelId: any) => {
        return await levelStore.getLevel(levelId);
    });

    ipcMain.handle("add-level", async (_, level: any) => {
        mainStore.addLevel(level.id);
        await levelStore.createLevel(level);
    });

    ipcMain.handle("remove-level", async (_, levelId: any) => {
        mainStore.removeLevel(levelId);
        levelStore.removeLevel(levelId);
    });

    return { mainStore, levelStore };
}

app.setPath("userData", path.join(app.getPath("appData"), "gotype"));

app.whenReady().then(() => {
    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((ext) => console.log(`Added Extension:  ${ext.name}`))
            .catch((err) => console.log("An error occurred: ", err));
    }

    const { levelStore } = createStore();
    createWindow();

    protocol.handle("level-file", (request) => {
        const filePath = request.url.slice("level-file://".length);
        return net.fetch(
            url
                .pathToFileURL(path.join(levelStore.getPath(), filePath))
                .toString()
        );
    });

    ipcMain.handle("quit-app", async () => {
        app.quit();
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
