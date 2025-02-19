import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { LevelDraftInfo, LevelDraftInitialInfo } from "@desktop-common/draft";

export async function createDraft(
    _: AppContext,
    draftInitial: LevelDraftInitialInfo
): PromiseResult<LevelDraftInfo, void> {
    try {
        const result = await window.levelDraftAPI.createDraft(draftInitial);
        return success(result);
    } catch {
        return failure();
    }
}
