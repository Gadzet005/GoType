import { failure, PromiseResult, success } from "@/core/types/result";

export async function removeLevel(levelId: number): PromiseResult<void, void> {
    try {
        await window.levelAPI.removeLevel(levelId);
        return success();
    } catch {
        return failure();
    }
}
