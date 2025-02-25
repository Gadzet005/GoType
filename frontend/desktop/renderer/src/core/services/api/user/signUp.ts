import { ApiError, ApiRoutes } from "@/core/config/api.config";
import { failure, PromiseResult } from "@/core/types/result";
import { SignUp } from "@/core/types/api/user";
import { AppContext } from "@/core/types/base/app";
import { saveUserInfo } from "@/core/services/electron/user/saveUserInfo";
import { commonApiErrorResult, success } from "../../../types/result";
import { getUserProfile } from "./getUserProfile";

export async function signUp(
    ctx: AppContext,
    name: string,
    password: string
): PromiseResult<void, string> {
    try {
        const response = await ctx.api.post(ApiRoutes.Auth.SIGN_UP, {
            name: name,
            password: password,
        } as SignUp.Args);

        const data: SignUp.Result = response.data;

        const tokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        };
        ctx.user.setTokens(tokens);

        const result = await ctx.runService(getUserProfile);
        if (!result.ok) {
            return failure(ApiError.unexpected);
        }
        const profile = result.payload;
        ctx.user.setProfile(profile);

        await ctx.runService(saveUserInfo, {
            profile,
            tokens,
        });

        return success();
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
