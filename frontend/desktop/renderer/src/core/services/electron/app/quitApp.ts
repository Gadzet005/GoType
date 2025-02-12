import { failure, PromiseResult, success } from "@/core/services/utils/result";

export async function quitApp(): PromiseResult<void, void> {
    try {
        await window.commonAPI.quitApp();
        return success();
    } catch {
        console.error("Failed to quit app");
        return failure();
    }
}
