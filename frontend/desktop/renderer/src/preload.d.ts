import { LevelData } from "@desktop-common/level";
import { UserInfo } from "@desktop-common/user";
import { FileInfo } from "@desktop-common/file";
import { DraftUpdate, DraftData } from "@desktop-common/draft";

declare global {
    interface Window {
        appAPI: {
            quitApp: () => Promise<void>;
            openFileDialog: (extensions?: string[]) => Promise<FileInfo[]>;
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
            getAllDrafts: () => Promise<s[]>;
            getDraft: (draftId: number) => Promise<DraftData>;
            removeDraft: (draftId: number) => Promise<void>;
            createDraft: () => Promise<DraftData>;
            updateDraft: (args: DraftUpdate.Args) => Promise<DraftData>;
        };
    }
}

export {};
