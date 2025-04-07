import { app, BrowserWindow, protocol } from "electron";
import {
    installExtension,
    REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import path from "path";
import url from "url";
import {
    ASSET_PROTOCOL_NAME,
    LEVEL_DRAFTS_DIR_NAME,
    LEVELS_DIR_NAME,
    USER_DATA_DIR_NAME,
} from "./consts";
import { initAppAPIHandlers } from "./handlers/appAPIHandlers";
import { initLevelAPIHandlers } from "./handlers/levelAPIHandlers";
import { initDraftAPIHandlers } from "./handlers/draftAPIHandlers";
import { initUserAPIHandlers } from "./handlers/userAPIHandlers";
import { initAssetProtocol } from "./protocols/asset";
import { LevelStorage } from "./storages/level";
import { DraftStorage } from "./storages/draft";
import { MainStorage } from "./storages/main";
import { logError } from "./utils/common";

const isDev = process.env.ELECTRON_IS_DEV ?? false;

protocol.registerSchemesAsPrivileged([
    {
        scheme: ASSET_PROTOCOL_NAME,
        privileges: {
            stream: true,
            bypassCSP: true,
        },
    },
]);

app.setPath("userData", path.join(app.getPath("appData"), USER_DATA_DIR_NAME));

function createWindow(): BrowserWindow {
    let mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        autoHideMenuBar: true,
        frame: false,
    });

    const startUrl = isDev
        ? process.env.ELECTRON_START_URL ?? ""
        : url
              .pathToFileURL(path.join(__dirname, "../dist/index.html"))
              .toString();

    mainWindow.maximize();
    mainWindow.loadURL(startUrl);
    return mainWindow;
}

app.whenReady().then(() => {
    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS).catch(
            logError("Can't install REACT_DEVELOPER_TOOLS")
        );
    }

    const mainStorage = new MainStorage();
    const levelStorage = new LevelStorage(
        mainStorage,
        path.join(app.getPath("userData"), LEVELS_DIR_NAME)
    );
    const draftStorage = new DraftStorage(
        mainStorage,
        path.join(app.getPath("userData"), LEVEL_DRAFTS_DIR_NAME)
    );

    initAppAPIHandlers();
    initUserAPIHandlers(mainStorage);
    initLevelAPIHandlers(levelStorage);
    initDraftAPIHandlers(draftStorage);

    initAssetProtocol();

    createWindow();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
