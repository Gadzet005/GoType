import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelInfo } from "@desktop-common/level";

export async function saveLevel(level: LevelInfo): PromiseResult<void, void> {
    try {
        await window.levelAPI.saveLevel(level);
        return success();
    } catch {
        return failure();
    }
}
