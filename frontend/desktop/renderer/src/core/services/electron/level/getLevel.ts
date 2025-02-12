import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { Level } from "@desktop-common/level";

export async function getLevel(
    _: AppContext,
    levelId: number
): PromiseResult<Level, void> {
    try {
        const result = await window.levelAPI.getLevel(levelId);
        if (!result) {
            throw new Error("Failed to get level");
        }

        return success(result);
    } catch {
        console.error("Failed to get level");
        return failure();
    }
}
