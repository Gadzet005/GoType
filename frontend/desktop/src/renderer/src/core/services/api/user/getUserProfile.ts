import { ApiRoutes } from "@/core/config/api.config";
import { PromiseResult } from "@/core/types/result";
import { UserProfile } from "@common/user";
import { commonApiErrorResult, success } from "../../../types/result";
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
            avatarURL: data.avatar_path.Valid ? data.avatar_path.String : null,
        };

        return success(profile);
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
