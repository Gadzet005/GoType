const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("appAPI", {
    quitApp: async () => {
        await ipcRenderer.invoke("quit-app");
    },
});

contextBridge.exposeInMainWorld("userAPI", {
    getUserInfo: async () => {
        return await ipcRenderer.invoke("get-user-info");
    },
    saveUserInfo: async (userInfo) => {
        await ipcRenderer.invoke("save-user-info", userInfo);
    },
    clearUserInfo: async () => {
        await ipcRenderer.invoke("clear-user-info");
    },
});

contextBridge.exposeInMainWorld("levelAPI", {
    getAllLevels: async () => {
        return await ipcRenderer.invoke("get-all-levels");
    },
    getLevel: async (levelId) => {
        return await ipcRenderer.invoke("get-level", levelId);
    },
    saveLevel: async (level) => {
        await ipcRenderer.invoke("save-level", level);
    },
    removeLevel: async (levelId) => {
        await ipcRenderer.invoke("remove-level", levelId);
    },
});

contextBridge.exposeInMainWorld("levelDraftAPI", {
    getAllDrafts: async () => {
        return await ipcRenderer.invoke("get-all-drafts");
    },
    getDraft: async (draftId) => {
        return await ipcRenderer.invoke("get-draft", draftId);
    },
    createDraft: async () => {
        return await ipcRenderer.invoke("create-draft");
    },
    updateDraft: async (draft) => {
        await ipcRenderer.invoke("update-draft", draft);
    },
    removeDraft: async (draftId) => {
        await ipcRenderer.invoke("remove-draft", draftId);
    },
});
