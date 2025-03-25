import { LevelInfo } from "@desktop-common/level";
import { UserInfo } from "@desktop-common/user";
import { FileInfo } from "@desktop-common/file";
import { DraftUpdate, DraftInfo } from "@desktop-common/draft";

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
            getAllLevels: () => Promise<LevelInfo[]>;
            getLevel: (levelId: number) => Promise<LevelInfo | null>;
            saveLevel: (level: LevelInfo) => Promise<void>;
            removeLevel: (levelId: number) => Promise<void>;
        };
        levelDraftAPI: {
            getAllDrafts: () => Promise<s[]>;
            getDraft: (draftId: number) => Promise<DraftInfo>;
            removeDraft: (draftId: number) => Promise<void>;
            createDraft: () => Promise<DraftInfo>;
            updateDraft: (args: DraftUpdate.Args) => Promise<DraftInfo>;
        };
    }
}

export {};
