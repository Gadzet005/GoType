import { LevelData } from "@desktop-common/level";
import { UserInfo } from "@desktop-common/user";
import { FileMeta } from "@desktop-common/file";
import { DraftUpdateData, DraftData } from "@desktop-common/draft";

declare global {
    interface Window {
        appAPI: {
            quitApp: () => Promise<void>;
            openFileDialog: (extensions?: string[]) => Promise<FileMeta[]>;
        };
        userAPI: {
            getUserInfo: () => Promise<UserInfo>;
            saveUserInfo: (userInfo: UserInfo) => Promise<void>;
            clearUserInfo: () => Promise<void>;
        };
        levelAPI: {
            getAllLevels: () => Promise<LevelData[]>;
            getLevel: (levelId: number) => Promise<LevelData | null>;
            saveLevel: (level: LevelData) => Promise<void>;
            removeLevel: (levelId: number) => Promise<void>;
        };
        levelDraftAPI: {
            getAllDrafts: () => Promise<DraftData[]>;
            getDraft: (draftId: number) => Promise<DraftData>;
            removeDraft: (draftId: number) => Promise<void>;
            createDraft: () => Promise<DraftData>;
            updateDraft: (data: DraftUpdateData) => Promise<DraftData>;
            showDraftDir: (draftId: number) => Promise<void>;
        };
    }
}

export {};
