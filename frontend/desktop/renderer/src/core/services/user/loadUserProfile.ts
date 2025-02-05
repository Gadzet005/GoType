import { ApiRoutes } from "@/core/config/api.config";
import { UserService } from "./userService";
import { Result } from "@/core/services/utils/result";
import { UserProfile } from "@/core/store/user";
import { commonApiErrorResult, success } from "../utils/result";
import { GetUserInfo } from "@/core/types/api/user";

type LoadResult = Result<UserProfile, string>;

export class loadUserProfileService extends UserService {
    override async execute(): Promise<LoadResult> {
        try {
            const response = await this.authApi.get(
                ApiRoutes.UserActions.GET_USER_INFO
            );
            const data: GetUserInfo.Result = response.data;

            this.user.setProfile({
                id: data.id,
                name: data.username,
                accessLevel: data.access,
                banInfo: {
                    reason: data.ban_reason,
                    expiresAt: Date.parse(data.ban_time),
                },
            });

            return success();
        } catch (error: any) {
            return commonApiErrorResult(error);
        }
    }
}
