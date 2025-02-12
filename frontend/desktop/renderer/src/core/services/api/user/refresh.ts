import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "../../utils/result";
import { clearAuthTokens } from "../../electron/tokens/clearAuthTokens";
import { ApiRoutes } from "@/core/config/api.config";
import { Refresh } from "@/core/types/api/user";
import { storeAuthTokens } from "../../electron/tokens/storeAuthTokens";

export async function refresh(ctx: AppContext): PromiseResult<void, void> {
    try {
        const response = await ctx.api.post(ApiRoutes.Auth.REFRESH_TOKEN, {
            access_token: ctx.user.tokens?.accessToken,
            refresh_token: ctx.user.tokens?.refreshToken,
        } as Refresh.Args);

        const data = response.data as Refresh.Result;
        const authTokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        };

        ctx.user.setTokens(authTokens);
        ctx.runService(storeAuthTokens, authTokens);

        return success();
    } catch {
        ctx.user.unauthorize();
        await ctx.runService(clearAuthTokens);
        return failure();
    }
}
