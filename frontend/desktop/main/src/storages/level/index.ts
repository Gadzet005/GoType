import { LevelData } from "@desktop-common/level";
import { logError } from "@/utils/common";
import { toStored, fromStored } from "./storedLevel";
import { FileSystemStorage } from "../base/FileSystemStorage";
import { AssetStorage } from "../assets/assetStorage";

export class LevelStorage extends FileSystemStorage {
    static readonly DATA_FILE = "level.json";

    async saveLevel(level: LevelData) {
        const levelDir = this.root.cwd(String(level.id));

        await levelDir
            .writeAsync(LevelStorage.DATA_FILE, toStored(level))
            .catch(
                logError(
                    `Failed to save level info to file. levelId = ${level.id}`
                )
            );

        this.mainStorage.savedLevels.add(level.id);
    }

    async getLevel(levelId: number): Promise<LevelData | null> {
        const levelDir = this.root.cwd(String(levelId));
        const assets = new AssetStorage(levelDir.path());

        const storedLevel = await levelDir
            .readAsync(LevelStorage.DATA_FILE, "json")
            .catch(
                logError(
                    `Failed to read level info from file. levelId = ${levelId}`
                )
            );

        return fromStored(storedLevel, assets);
    }

    async getAllLevels(): Promise<LevelData[]> {
        const levelIds = this.mainStorage.savedLevels.getAll();

        const awaitedLevels: Promise<LevelData | null>[] = [];
        for (const levelId of levelIds) {
            awaitedLevels.push(this.getLevel(levelId));
        }

        const levels: LevelData[] = [];
        for (const awaitedLevel of awaitedLevels) {
            const level = await awaitedLevel;
            if (level) {
                levels.push(level);
            }
        }

        return levels;
    }

    async removeLevel(levelId: number) {
        const levelDir = this.root.cwd(String(levelId));

        this.mainStorage.savedLevels.remove(levelId);
        await levelDir
            .removeAsync()
            .catch(
                logError(
                    `Failed to remove level directory. levelId = ${levelId}`
                )
            );
    }
}
