import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { AuthTokens } from "@desktop-common/authTokens";

export async function getAuthTokens(): PromiseResult<AuthTokens, void> {
    try {
        const result = await window.userAPI.getTokens();
        if (!result) {
            return failure();
        }

        return success(result as AuthTokens);
    } catch {
        return failure();
    }
}
