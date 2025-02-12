import { failure, PromiseResult, success } from "@/core/services/utils/result";

export async function clearAuthTokens(): PromiseResult<void, void> {
    try {
        await window.userAPI.clearTokens();
        return success();
    } catch {
        console.error("Failed to clear auth tokens");
        return failure();
    }
}
