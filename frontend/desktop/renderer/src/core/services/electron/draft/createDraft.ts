import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftData } from "@desktop-common/draft";

export async function createDraft(): PromiseResult<DraftData, void> {
    try {
        const result = await window.levelDraftAPI.createDraft();
        return success(result);
    } catch {
        return failure();
    }
}
