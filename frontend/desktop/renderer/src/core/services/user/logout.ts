import { ApiRoutes } from "@/core/config/api.config";
import { UserService } from "./userService";
import { Result } from "@/core/services/utils/result";
import { commonApiErrorResult, success } from "../utils/result";

type LogoutResult = Result<void, string>;

export class LogoutService extends UserService {
    override async execute(): Promise<LogoutResult> {
        try {
            await this.authApi.post(ApiRoutes.UserActions.LOGOUT);
            this.user.unauthorize();
            await window.userAPI.clearTokens();
            return success();
        } catch (error: any) {
            return commonApiErrorResult(error);
        }
    }
}
