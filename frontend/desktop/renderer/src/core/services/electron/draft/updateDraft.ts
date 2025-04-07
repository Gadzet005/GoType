import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftData, DraftUpdateData } from "@desktop-common/draft";

export async function updateDraft(
    updateInfo: DraftUpdateData
): PromiseResult<DraftData, void> {
    try {
        const draft = await window.levelDraftAPI.updateDraft(updateInfo);
        return success(draft);
    } catch {
        return failure();
    }
}
