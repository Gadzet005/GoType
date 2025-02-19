import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { LevelDraftInfo } from "@desktop-common/draft";

export async function getDraft(
    _: AppContext,
    draftId: number
): PromiseResult<LevelDraftInfo, void> {
    try {
        const result = await window.levelDraftAPI.getDraft(draftId);
        if (!result) {
            return failure();
        }
        return success(result);
    } catch {
        return failure();
    }
}
