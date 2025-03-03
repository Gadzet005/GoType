import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftData, DraftUpdate } from "@desktop-common/draft";

export async function updateDraft(
    updateInfo: DraftUpdate.Args
): PromiseResult<DraftData, void> {
    try {
        const draft = await window.levelDraftAPI.updateDraft(updateInfo);
        return success(draft);
    } catch {
        return failure();
    }
}
