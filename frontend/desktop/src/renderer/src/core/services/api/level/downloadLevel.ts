import { ApiRoutes } from "@/core/config/api.config";
import { AppContext } from "@/core/types/base/app";
import {
    commonApiErrorResult,
    failure,
    PromiseResult,
    success,
} from "@/core/types/result";
import { importLevel } from "../../electron/level/importLevel";

export async function downloadLevel(
    ctx: AppContext,
    levelId: number
): PromiseResult<void, string> {
    try {
        const response = await ctx.authApi.post(
            ApiRoutes.Level.DOWNLOAD_LEVEL,
            { id: levelId }
        );

        const result = await importLevel(levelId, response.data);
        if (!result.ok) {
            return failure("Failed to import level");
        }

        return success();
    } catch (err) {
        return commonApiErrorResult(err);
    }
}
