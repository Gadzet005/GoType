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
import { appConfig } from "./config";

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
    const preloadPath = appConfig.isDev
        ? path.join(__dirname, "preload.js")
        : path.join(app.getAppPath(), "../preload.js");

    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: preloadPath,
        },
        autoHideMenuBar: true,
        frame: false,
    });

    const productionURL = url
        .pathToFileURL(path.join(__dirname, "../renderer/index.html"))
        .toString();
    const startUrl = appConfig.isDev ? appConfig.devRendererURL : productionURL;

    mainWindow.maximize();
    mainWindow.loadURL(startUrl);
    return mainWindow;
}

app.whenReady().then(() => {
    if (appConfig.isDev) {
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
