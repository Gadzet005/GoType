import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelInfo } from "@desktop-common/level";

export async function getLevel(
    levelId: number
): PromiseResult<LevelInfo, void> {
    try {
        const result = await window.levelAPI.getLevel(levelId);
        if (!result) {
            return failure();
        }

        return success(result);
    } catch {
        return failure();
    }
}
