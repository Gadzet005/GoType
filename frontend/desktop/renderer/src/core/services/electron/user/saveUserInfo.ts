import { AppContext } from "@/core/types/base/app";
import { failure, PromiseResult, success } from "@/core/types/result";
import { UserInfo } from "@desktop-common/user";

export async function saveUserInfo(
    _: AppContext,
    userInfo: UserInfo
): PromiseResult<void, void> {
    try {
        await window.userAPI.saveUserInfo(userInfo);
        return success();
    } catch (error) {
        console.error(error);
        return failure();
    }
}
