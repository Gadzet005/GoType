import { ApiRoutes } from "@/core/config/api.config";
import { failure, PromiseResult } from "@/core/types/result";
import { commonApiErrorResult, success } from "../../../types/result";
import { AppContext } from "@/core/types/base/app";
import { getUserProfile } from "./getUserProfile";

export async function changeUserAvatar(
    ctx: AppContext,
    avatar: Blob
): PromiseResult<void, string> {
    try {
        const formData = new FormData();
        formData.append("avatar", avatar);
        await ctx.authApi.post(ApiRoutes.UserActions.CHANGE_AVATAR, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (ctx.user.profile?.avatarURL === null) {
            const result = await getUserProfile(ctx);
            if (result.ok) {
                ctx.user.setProfile(result.payload);
            } else {
                return failure(result.error);
            }
        }

        return success();
    } catch (error: any) {
        return commonApiErrorResult(error);
    }
}
