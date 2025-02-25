import { failure, PromiseResult, success } from "@/core/types/result";
import { LevelDraftInfo } from "@desktop-common/draft";

export async function createDraft(): PromiseResult<LevelDraftInfo, void> {
    try {
        const result = await window.levelDraftAPI.createDraft();
        return success(result);
    } catch {
        return failure();
    }
}
