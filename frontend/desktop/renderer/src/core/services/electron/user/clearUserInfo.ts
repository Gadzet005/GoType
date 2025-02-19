import { failure, PromiseResult, success } from "@/core/services/utils/result";

export async function clearUserInfo(): PromiseResult<void, void> {
    try {
        await window.userAPI.clearUserInfo();
        return success();
    } catch (error) {
        console.error(error);
        return failure();
    }
}
