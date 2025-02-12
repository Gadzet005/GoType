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
            return failure();
        }

        return success(result);
    } catch {
        return failure();
    }
}
