import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelData } from "@common/level";

export async function getLevel(
    levelId: number
): PromiseResult<LevelData, void> {
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
