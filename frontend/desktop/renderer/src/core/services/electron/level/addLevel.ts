import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { AppContext } from "@/core/types/base/app";
import { Level } from "@desktop-common/level";

export async function addLevel(
    _: AppContext,
    level: Level
): PromiseResult<void, void> {
    try {
        await window.levelAPI.addLevel(level);
        return success();
    } catch {
        return failure();
    }
}
