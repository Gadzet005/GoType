import { ApiError, ApiRoutes } from "@/core/config/api.config";
import { failure, PromiseResult } from "@/core/types/result";
import { SignIn } from "@/core/types/api/user";
import { AppContext } from "@/core/types/base/app";
import { saveUserInfo } from "@/core/services/electron/user/saveUserInfo";
import { commonApiErrorResult, success } from "../../../types/result";
import { getUserProfile } from "./getUserProfile";
import { AuthTokens } from "@desktop-common/user";

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

        const tokens: AuthTokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        };
        ctx.user.setTokens(tokens);

        const result = await getUserProfile(ctx);
        if (!result.ok) {
            return failure(ApiError.unexpected);
        }
        const profile = result.payload;
        ctx.user.setProfile(profile);

        await saveUserInfo({
            profile,
            tokens,
        });

        return success();
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
