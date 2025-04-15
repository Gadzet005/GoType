import { ExternalLevelData, LevelData } from "@common/level";
import { logError } from "../../utils/common";
import { fromStored, StoredLevelData } from "./storedLevel";
import { FileSystemStorage } from "../base/FileSystemStorage";
import { extractZipBuffer } from "../../utils/zip";

export class LevelStorage extends FileSystemStorage {
    static readonly DATA_FILE = "level.json";

    async getLevel(levelId: number): Promise<LevelData | null> {
        const levelDir = this.root.cwd(String(levelId));

        const storedLevel: StoredLevelData = await levelDir
            .readAsync(LevelStorage.DATA_FILE, "json")
            .catch(
                logError(
                    `Failed to read level info from file. levelId = ${levelId}`
                )
            );

        return fromStored(storedLevel, levelDir.path());
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

    async importLevel(levelId: number, levelArchive: string): Promise<void> {
        const levelDir = this.root.cwd(String(levelId));
        await levelDir.removeAsync();
        await extractZipBuffer(levelArchive, levelDir.path()).catch(
            logError("Failed to extract level archive.")
        );

        const externalData: ExternalLevelData = await levelDir
            .readAsync(LevelStorage.DATA_FILE, "json")
            .catch(
                logError(
                    `Failed to read level info from file. levelId = ${levelId}`
                )
            );

        const levelData: StoredLevelData = {
            id: levelId,
            ...externalData,
            duration: externalData.duration * 1000,
        };

        await levelDir
            .writeAsync(LevelStorage.DATA_FILE, levelData)
            .catch(
                logError(
                    `Failed to save level info to file. levelId = ${levelId}`
                )
            );

        this.mainStorage.savedLevels.add(levelId);
    }
}
