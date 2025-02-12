import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "@/core/services/utils/result";
import { AuthTokens } from "@desktop-common/authTokens";

export async function storeAuthTokens(
    _: AppContext,
    tokens: AuthTokens
): PromiseResult<void, void> {
    try {
        await window.userAPI.storeTokens(
            tokens.accessToken,
            tokens.refreshToken
        );
        return success();
    } catch {
        console.error("Failed to store auth tokens");
        return failure();
    }
}
