import { ApiRoutes } from "@/core/config/api.config";
import { PromiseResult } from "@/core/types/result";
import { commonApiErrorResult, success } from "../../../types/result";
import { AppContext } from "@/core/types/base/app";
import { clearUserInfo } from "../../electron/user/clearUserInfo";

export async function logout(ctx: AppContext): PromiseResult<void, string> {
    try {
        ctx.user.unauthorize();
        await clearUserInfo();
        await ctx.authApi.post(ApiRoutes.UserActions.LOGOUT);
        return success();
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
