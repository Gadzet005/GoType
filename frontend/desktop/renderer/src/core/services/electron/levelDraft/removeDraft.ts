import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "@/core/types/result";

export async function removeDraft(
    _: AppContext,
    draftId: number
): PromiseResult<void, void> {
    try {
        await window.levelDraftAPI.removeDraft(draftId);
        return success();
    } catch {
        return failure();
    }
}
