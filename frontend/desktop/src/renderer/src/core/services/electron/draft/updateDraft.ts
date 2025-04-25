import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftData, DraftUpdateData } from "@common/draft";

export async function updateDraft(
    updateInfo: DraftUpdateData
): PromiseResult<DraftData, string> {
    try {
        const draft = await window.levelDraftAPI.updateDraft(updateInfo);
        return success(draft);
    } catch (err) {
        return failure(`${err}`);
    }
}
