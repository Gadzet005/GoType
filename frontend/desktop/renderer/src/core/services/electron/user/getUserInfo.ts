import { failure, PromiseResult, success } from "@/core/types/result";
import { UserInfo } from "@desktop-common/user";

export async function getUserInfo(): PromiseResult<UserInfo, void> {
    try {
        const result = await window.userAPI.getUserInfo();
        if (!result) {
            return failure();
        }

        return success(result);
    } catch {
        return failure();
    }
}
