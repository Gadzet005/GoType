export namespace ElectronAPIMock {
    export const User = {
        storeTokens: vi.fn(),
        getTokens: vi.fn(),
        clearTokens: vi.fn(),
    };

    export const Level = {
        getLevels: vi.fn(),
        getLevel: vi.fn(),
        addLevel: vi.fn(),
        removeLevel: vi.fn(),
    };

    export const App = {
        quitApp: vi.fn(),
    };
}

window.userAPI = ElectronAPIMock.User;
window.levelAPI = ElectronAPIMock.Level;
window.commonAPI = ElectronAPIMock.App;
