import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { LevelInfo } from "@desktop-common/level";

export async function getAllLevels(): PromiseResult<LevelInfo[], void> {
    try {
        const result = await window.levelAPI.getAllLevels();
        return success(result);
    } catch {
        return failure();
    }
}
