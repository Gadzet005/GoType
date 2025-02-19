import fs from "fs/promises";
import path from "path";
import { LevelInfo } from "@desktop-common/level";
import { ignoreCode, logError } from "@/utils/common";
import { toStored, fromStored, StoredLevel } from "./storedLevel";
import { FileSystemStorage } from "../base/FileSystemStorage";

export class LevelStorage extends FileSystemStorage {
    private static INFO_FILE_NAME = "level.json";

    private getLevelPath(id: number): string {
        return path.join(this.dir, String(id));
    }

    async saveLevel(level: LevelInfo) {
        const levelPath = this.getLevelPath(level.id);

        await fs
            .mkdir(levelPath)
            .catch(ignoreCode("EEXIST"))
            .catch(logError("Failed to create level directory"));

        await fs
            .writeFile(
                path.join(levelPath, LevelStorage.INFO_FILE_NAME),
                JSON.stringify(toStored(level), null, 2)
            )
            .catch(logError("Failed to write level info to file"));

        this.mainStorage.savedLevels.add(level.id);
    }

    async getLevel(levelId: number): Promise<LevelInfo | null> {
        const levelPath = this.getLevelPath(levelId);
        const levelJson = await fs
            .readFile(path.join(levelPath, LevelStorage.INFO_FILE_NAME), "utf8")
            .catch((err) => {
                ignoreCode("ENOENT")(err);
                return null;
            })
            .catch(
                logError(
                    `Failed to read level info from file. levelId = ${levelId}`
                )
            );

        if (levelJson === null) {
            return null;
        }

        const storedLevel = JSON.parse(levelJson) as StoredLevel;
        return fromStored(storedLevel);
    }

    async getAllLevels(): Promise<LevelInfo[]> {
        const levelIds = this.mainStorage.savedLevels.getAll();

        const awaitedLevels: Promise<LevelInfo | null>[] = [];
        for (const levelId of levelIds) {
            awaitedLevels.push(this.getLevel(levelId));
        }

        const levels: LevelInfo[] = [];
        for (const awaitedLevel of awaitedLevels) {
            const level = await awaitedLevel;
            if (level) {
                levels.push(level);
            }
        }

        return levels;
    }

    async removeLevel(levelId: number) {
        this.mainStorage.savedLevels.remove(levelId);
        const levelPath = this.getLevelPath(levelId);
        await fs
            .rmdir(levelPath, { recursive: true })
            .catch(
                logError(
                    `Failed to remove level directory. levelId = ${levelId}`
                )
            );
    }
}
