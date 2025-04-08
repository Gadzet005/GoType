import { failure, PromiseResult, success } from "@/core/types/result";

export async function clearUserInfo(): PromiseResult<void, void> {
    try {
        await window.userAPI.clearUserInfo();
        return success();
    } catch (error) {
        console.error(error);
        return failure();
    }
}
