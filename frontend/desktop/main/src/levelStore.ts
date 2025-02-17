import fs from "fs/promises";
import path from "path";
import url from "url";
import { Level } from "../../common/level";
import { Sentence } from "../../common/sentence";
import { AudioType, PictureType, VideoType } from "../../common/types";

interface StoredLevel extends Omit<Level, "preview" | "game"> {
    previewType: PictureType;
    audioType: AudioType;
    backgroundType: PictureType | VideoType;
    sentences: Sentence[];
}

export class LevelStore {
    static readonly PREVIEW_FILENAME = "preview";
    static readonly AUDIO_FILENAME = "audio";
    static readonly BACKGROUND_FILENAME = "background";
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    private getLevelPath(levelId: number): string {
        return path.join(this.path, String(levelId));
    }

    private getLevelAssetUrl(levelId: number, fileName: string): string {
        return url
            .format({
                pathname: path.join(String(levelId), fileName),
                protocol: "level-asset:",
                slashes: true,
            })
            .toString();
    }

    private serialize(level: Level): StoredLevel {
        return {
            id: level.id,
            name: level.name,
            description: level.description,
            author: level.author,
            duration: level.duration,
            tags: level.tags,
            languageCode: level.languageCode,
            previewType: level.preview.type,
            audioType: level.game.audio.type,
            backgroundType: level.game.background.type,
            sentences: level.game.sentences,
        };
    }

    private deserialize(stored: StoredLevel): Level {
        return {
            id: stored.id,
            name: stored.name,
            description: stored.description,
            author: stored.author,
            duration: stored.duration,
            tags: stored.tags,
            languageCode: stored.languageCode,
            preview: {
                type: stored.previewType,
                url: this.getLevelAssetUrl(
                    stored.id,
                    LevelStore.PREVIEW_FILENAME + "." + stored.previewType
                ),
            },
            game: {
                audio: {
                    type: stored.audioType,
                    url: this.getLevelAssetUrl(
                        stored.id,
                        LevelStore.AUDIO_FILENAME + "." + stored.audioType
                    ),
                },
                background: {
                    type: stored.backgroundType,
                    url: this.getLevelAssetUrl(
                        stored.id,
                        LevelStore.BACKGROUND_FILENAME +
                            "." +
                            stored.backgroundType
                    ),
                },
                sentences: stored.sentences,
            },
        };
    }

    async createLevel(level: Level) {
        const levelPath = this.getLevelPath(level.id);
        await fs.mkdir(levelPath, { recursive: true }).catch((err) => {
            if (err.code !== "EEXIST") {
                throw err;
            }
        });

        await fs.writeFile(
            path.join(levelPath, "level.json"),
            JSON.stringify(this.serialize(level), null, 2)
        );
    }

    async getLevel(levelId: number): Promise<Level | null> {
        const levelPath = this.getLevelPath(levelId);
        try {
            const levelJson = await fs.readFile(
                path.join(levelPath, "level.json"),
                "utf8"
            );
            const storedLevel = JSON.parse(levelJson) as StoredLevel;
            return this.deserialize(storedLevel);
        } catch (err: any) {
            if (err.code === "ENOENT") {
                return null;
            }
            throw err;
        }
    }

    async removeLevel(levelId: number) {
        const levelPath = this.getLevelPath(levelId);
        await fs.rmdir(levelPath, { recursive: true });
    }

    getPath(): string {
        return this.path;
    }
}
