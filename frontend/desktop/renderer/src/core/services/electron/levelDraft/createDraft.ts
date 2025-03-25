import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftInfo } from "@desktop-common/draft";

export async function createDraft(): PromiseResult<DraftInfo, void> {
    try {
        const result = await window.levelDraftAPI.createDraft();
        return success(result);
    } catch {
        return failure();
    }
}
