import { LevelData } from "@common/level";
import { UserInfo } from "@common/user";
import { FileMeta } from "@common/file";
import { DraftUpdateData, DraftData } from "@common/draft";
import { AppConfig } from "@common/config";

declare global {
    interface Window {
        appAPI: {
            quitApp: () => Promise<void>;
            openFileDialog: (extensions?: string[]) => Promise<FileMeta[]>;
            getConfig: () => Promise<AppConfig>;
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
