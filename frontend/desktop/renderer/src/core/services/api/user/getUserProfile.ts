import { ApiRoutes } from "@/core/config/api.config";
import { PromiseResult } from "@/core/services/utils/result";
import { UserProfile } from "@desktop-common/user";
import { commonApiErrorResult, success } from "../../utils/result";
import { GetUserInfo } from "@/core/types/api/user";
import { AppContext } from "@/core/types/base/app";

export async function getUserProfile(
    ctx: AppContext
): PromiseResult<UserProfile, string> {
    try {
        const response = await ctx.authApi.get(
            ApiRoutes.UserActions.GET_USER_INFO
        );
        const data: GetUserInfo.Result = response.data;

        const profile: UserProfile = {
            id: data.id,
            name: data.username,
            accessLevel: data.access,
            banInfo: {
                reason: data.ban_reason,
                expiresAt: Date.parse(data.ban_time),
            },
        };

        return success(profile);
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
