import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelDraftInfo } from "@desktop-common/draft";

export async function getAllDrafts(): PromiseResult<LevelDraftInfo[], void> {
    try {
        const result = await window.levelDraftAPI.getAllDrafts();
        return success(result);
    } catch {
        return failure();
    }
}
