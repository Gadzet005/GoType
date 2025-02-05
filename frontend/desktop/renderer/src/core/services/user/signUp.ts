import { ApiRoutes } from "@/core/config/api.config";
import { UserService } from "./userService";
import { Result } from "@/core/services/utils/result";
import { commonApiErrorResult, success } from "../utils/result";
import { loadUserProfileService } from "./loadUserProfile";
import { SignUp } from "@/core/types/api/user";

interface SignUpServiceArgs {
    name: string;
    password: string;
}

export type SignUpServiceResult = Result<void, string>;

export class SignUpService extends UserService {
    override async execute(
        args: SignUpServiceArgs
    ): Promise<SignUpServiceResult> {
        try {
            const response = await this.api.post(ApiRoutes.Auth.SIGN_UP, {
                name: args.name,
                password: args.password,
            } as SignUp.Args);

            const data: SignUp.Result = response.data;
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;

            this.user.setTokens({ accessToken, refreshToken });
            await window.userAPI.storeTokens(accessToken, refreshToken);

            const loadProfileService = new loadUserProfileService(this.user);
            const result = await loadProfileService.execute();
            if (!result.ok) {
                return result as SignUpServiceResult;
            }

            return success();
        } catch (error: any) {
            return commonApiErrorResult(error);
        }
    }
}
