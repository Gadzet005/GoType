import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelDraftInfo } from "@desktop-common/draft";

export async function updateDraft(
    _: AppContext,
    draft: LevelDraftInfo
): PromiseResult<void, void> {
    try {
        await window.levelDraftAPI.updateDraft(draft);
        return success();
    } catch {
        return failure();
    }
}
