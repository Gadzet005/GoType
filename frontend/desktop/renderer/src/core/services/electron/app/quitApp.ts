import { failure, PromiseResult, success } from "@/core/services/utils/result";

export async function quitApp(): PromiseResult<void, void> {
    try {
        await window.appAPI.quitApp();
        return success();
    } catch {
        return failure();
    }
}
