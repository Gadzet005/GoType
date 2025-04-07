import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelData } from "@desktop-common/level";

export async function saveLevel(level: LevelData): PromiseResult<void, void> {
    try {
        await window.levelAPI.saveLevel(level);
        return success();
    } catch {
        return failure();
    }
}
