import { failure, PromiseResult, success } from "@/core/types/result";

export async function importLevel(
    levelId: number,
    levelArchive: string
): PromiseResult<void, void> {
    try {
        await window.levelAPI.importLevel(levelId, levelArchive);
        return success();
    } catch {
        return failure();
    }
}
