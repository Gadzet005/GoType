import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelCreationData } from "@common/draft";

export async function getLevelCreationData(
    levelId: number
): PromiseResult<LevelCreationData, void> {
    try {
        const result = await window.levelDraftAPI.getLevelCreationData(levelId);
        if (!result) {
            return failure();
        }
        return success(result);
    } catch {
        return failure();
    }
}
