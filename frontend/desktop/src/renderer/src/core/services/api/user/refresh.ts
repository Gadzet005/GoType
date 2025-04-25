import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "../../../types/result";
import { clearUserInfo } from "@/core/services/electron/user/clearUserInfo";
import { ApiRoutes } from "@/core/config/api.config";
import { Refresh } from "@/core/types/api/user";
import { saveUserInfo } from "@/core/services/electron/user/saveUserInfo";

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
        saveUserInfo({
            profile: ctx.user.profile!,
            tokens: authTokens,
        });

        return success();
    } catch {
        ctx.user.unauthorize();
        await clearUserInfo();
        return failure();
    }
}
