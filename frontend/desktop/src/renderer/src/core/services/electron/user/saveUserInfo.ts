import { failure, PromiseResult, success } from "@/core/types/result";
import { UserInfo } from "@common/user";
import structuredClone from "@ungap/structured-clone";

export async function saveUserInfo(
    userInfo: UserInfo
): PromiseResult<void, void> {
    try {
        const info = structuredClone(userInfo, { lossy: true });
        await window.userAPI.saveUserInfo(info);
        return success();
    } catch (error) {
        console.error(error);
        return failure();
    }
}
