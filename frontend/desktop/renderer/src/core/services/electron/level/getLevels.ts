import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { Level } from "@desktop-common/level";

export async function getLevels(): PromiseResult<Level[], void> {
    try {
        const result = await window.levelAPI.getLevels();
        return success(result);
    } catch {
        return failure();
    }
}
