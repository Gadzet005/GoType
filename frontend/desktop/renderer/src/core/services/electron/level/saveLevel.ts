import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { AppContext } from "@/core/types/base/app";
import { LevelInfo } from "@desktop-common/level";

export async function saveLevel(
    _: AppContext,
    level: LevelInfo
): PromiseResult<void, void> {
    try {
        await window.levelAPI.saveLevel(level);
        return success();
    } catch {
        return failure();
    }
}
