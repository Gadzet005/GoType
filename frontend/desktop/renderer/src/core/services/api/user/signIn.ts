import { ApiError, ApiRoutes } from "@/core/config/api.config";
import { failure, PromiseResult } from "@/core/services/utils/result";
import { SignIn } from "@/core/types/api/user";
import { AppContext } from "@/core/types/base/app";
import { storeAuthTokens } from "../../electron/tokens/storeAuthTokens";
import { commonApiErrorResult, success } from "../../utils/result";
import { loadUserProfile } from "./loadUserProfile";

export async function signIn(
    ctx: AppContext,
    name: string,
    password: string
): PromiseResult<void, string> {
    try {
        const response = await ctx.api.post(ApiRoutes.Auth.SIGN_IN, {
            name: name,
            password: password,
        } as SignIn.Args);

        const data: SignIn.Result = response.data;
        const authTokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        };

        ctx.user.setTokens(authTokens);
        await ctx.runService(storeAuthTokens, authTokens);

        const result = await ctx.runService(loadUserProfile);
        if (!result.ok) {
            return failure(ApiError.unexpected);
        }

        return success();
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
