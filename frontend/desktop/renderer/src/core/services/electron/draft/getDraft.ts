import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftData } from "@desktop-common/draft";

export async function getDraft(
    draftId: number
): PromiseResult<DraftData, void> {
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
