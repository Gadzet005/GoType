import { LevelInfo } from "@desktop-common/level";
import { UserInfo } from "@desktop-common/user";
import { LevelDraftInfo, LevelDraftInitialInfo } from "@desktop-common/draft";

declare global {
    interface Window {
        appAPI: {
            quitApp: () => Promise<void>;
        };
        userAPI: {
            getUserInfo: () => Promise<UserInfo>;
            saveUserInfo: (userInfo: UserInfo) => Promise<void>;
            clearUserInfo: () => Promise<void>;
        };
        levelAPI: {
            getAllLevels: () => Promise<LevelInfo[]>;
            getLevel: (levelId: number) => Promise<LevelInfo | null>;
            saveLevel: (level: LevelInfo) => Promise<void>;
            removeLevel: (levelId: number) => Promise<void>;
        };
        levelDraftAPI: {
            getAllDrafts: () => Promise<LevelDraftInfo[]>;
            getDraft: (draftId: number) => Promise<LevelDraftInfo>;
            removeDraft: (draftId: number) => Promise<void>;
            createDraft: (
                draftInitial: LevelDraftInitialInfo
            ) => Promise<LevelDraftInfo>;
            updateDraft: (draft: LevelDraftInfo) => Promise<void>;
        };
    }
}

export {};
