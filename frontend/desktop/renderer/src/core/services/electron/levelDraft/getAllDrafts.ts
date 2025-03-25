import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftInfo } from "@desktop-common/draft";

export async function getAllDrafts(): PromiseResult<DraftInfo[], void> {
    try {
        const result = await window.levelDraftAPI.getAllDrafts();
        return success(result);
    } catch {
        return failure();
    }
}
