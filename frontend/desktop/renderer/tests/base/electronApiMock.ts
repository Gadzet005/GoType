import { Level } from "@desktop-common/level";

window.userAPI = {
    storeTokens: vi.fn(async () => {}),
    getTokens: vi.fn(async (): Promise<any> => {}),
    clearTokens: vi.fn(async () => {}),
};

window.levelAPI = {
    getLevels: vi.fn(async (): Promise<Level[]> => []),
    getLevel: vi.fn(async (): Promise<Level | null> => null),
    addLevel: vi.fn(async (): Promise<void> => {}),
    removeLevel: vi.fn(async (): Promise<void> => {}),
};
