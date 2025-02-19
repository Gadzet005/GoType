export namespace ElectronAPIMock {
    export const User = {
        getUserInfo: vi.fn(),
        saveUserInfo: vi.fn(),
        clearUserInfo: vi.fn(),
    };

    export const Level = {
        getAllLevels: vi.fn(),
        getLevel: vi.fn(),
        saveLevel: vi.fn(),
        removeLevel: vi.fn(),
    };

    export const LevelDraft = {
        getDraft: vi.fn(),
        createDraft: vi.fn(),
        updateDraft: vi.fn(),
        removeDraft: vi.fn(),
        getAllDrafts: vi.fn(),
    };

    export const App = {
        quitApp: vi.fn(),
    };
}

window.userAPI = ElectronAPIMock.User;
window.levelAPI = ElectronAPIMock.Level;
window.appAPI = ElectronAPIMock.App;
window.levelDraftAPI = ElectronAPIMock.LevelDraft;
