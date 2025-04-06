import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftData } from "@desktop-common/draft";

export async function getAllDrafts(): PromiseResult<DraftData[], void> {
    try {
        const result = await window.levelDraftAPI.getAllDrafts();
        return success(result);
    } catch {
        return failure();
    }
}
