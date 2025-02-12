import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { AppContext } from "@/core/types/base/app";

export async function removeLevel(
    _: AppContext,
    levelId: number
): PromiseResult<void, void> {
    try {
        await window.levelAPI.removeLevel(levelId);
        return success();
    } catch {
        return failure();
    }
}
