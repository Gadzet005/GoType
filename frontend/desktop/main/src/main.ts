import { app, BrowserWindow, protocol } from "electron";
import path from "path";
import url from "url";
import {
    installExtension,
    REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { ProtocolNames } from "./consts";
import { logError } from "./utils/common";
import { MainStorage } from "./storages/main";
import { LevelStorage } from "./storages/level";
import { LevelDraftStorage } from "./storages/levelDraft";
import { initAppAPIHandlers } from "./handlers/appAPIHandlers";
import { initUserAPIHandlers } from "./handlers/userAPIHandlers";
import { initLevelAPIHandlers } from "./handlers/levelAPIHandlers";
import { initLevelDraftAPIHandlers } from "./handlers/levelDraftAPIHandlers";
import { getDirProtocolHandler } from "./utils/protocols";

const isDev = process.env.ELECTRON_IS_DEV || false;

protocol.registerSchemesAsPrivileged([
    {
        scheme: ProtocolNames.LEVEL_ASSET,
        privileges: {
            stream: true,
            bypassCSP: true,
        },
    },
    {
        scheme: ProtocolNames.LEVEL_DRAFT_ASSET,
        privileges: {
            stream: true,
            bypassCSP: true,
        },
    },
]);

app.setPath("userData", path.join(app.getPath("appData"), "gotype"));

function createWindow(): BrowserWindow {
    let mainWindow = new BrowserWindow({
        webPreferences: {
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

app.whenReady().then(() => {
    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS).catch(
            logError("Can't install REACT_DEVELOPER_TOOLS")
        );
    }

    const mainStorage = new MainStorage();
    const levelStorage = new LevelStorage(
        mainStorage,
        path.join(app.getPath("userData"), "levels")
    );
    const levelDraftStorage = new LevelDraftStorage(
        mainStorage,
        path.join(app.getPath("userData"), "level-drafts")
    );

    initAppAPIHandlers();
    initUserAPIHandlers(mainStorage);
    initLevelAPIHandlers(levelStorage);
    initLevelDraftAPIHandlers(levelDraftStorage);

    protocol.handle(
        ProtocolNames.LEVEL_ASSET,
        getDirProtocolHandler(ProtocolNames.LEVEL_ASSET, levelStorage.dir)
    );
    protocol.handle(
        ProtocolNames.LEVEL_DRAFT_ASSET,
        getDirProtocolHandler(
            ProtocolNames.LEVEL_DRAFT_ASSET,
            levelDraftStorage.dir
        )
    );

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
