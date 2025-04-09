import { failure, PromiseResult, success } from "@/core/types/result";
import { DraftData } from "@common/draft";

export async function getAllDrafts(): PromiseResult<DraftData[], void> {
    try {
        const result = await window.levelDraftAPI.getAllDrafts();
        return success(result);
    } catch {
        return failure();
    }
}
