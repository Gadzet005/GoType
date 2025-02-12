import { ApiRoutes } from "@/core/config/api.config";
import { PromiseResult } from "@/core/services/utils/result";
import { commonApiErrorResult, success } from "../../utils/result";
import { AppContext } from "@/core/types/base/app";
import { clearAuthTokens } from "../../electron/tokens/clearAuthTokens";

export async function logout(ctx: AppContext): PromiseResult<void, string> {
    try {
        await ctx.authApi.post(ApiRoutes.UserActions.LOGOUT);
        ctx.user.unauthorize();
        await ctx.runService(clearAuthTokens);
        return success();
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
