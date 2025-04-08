import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelData } from "@desktop-common/level";

export async function getAllLevels(): PromiseResult<LevelData[], void> {
    try {
        const result = await window.levelAPI.getAllLevels();
        return success(result);
    } catch {
        return failure();
    }
}
