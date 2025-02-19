import { ApiRoutes } from "@/core/config/api.config";
import { PromiseResult } from "@/core/services/utils/result";
import { commonApiErrorResult, success } from "../../utils/result";
import { AppContext } from "@/core/types/base/app";
import { clearUserInfo } from "../../electron/user/clearUserInfo";

export async function logout(ctx: AppContext): PromiseResult<void, string> {
    try {
        await ctx.authApi.post(ApiRoutes.UserActions.LOGOUT);
        ctx.user.unauthorize();
        await ctx.runService(clearUserInfo);
        return success();
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
