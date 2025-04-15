import { ApiRoutes } from "@/core/config/api.config";
import { AppContext } from "@/core/types/base/app";
import {
    commonApiErrorResult,
    failure,
    PromiseResult,
    success,
} from "@/core/types/result";
import { importLevel } from "../../electron/level/importLevel";
import { blobToBase64 } from "./utils";

export async function downloadLevel(
    ctx: AppContext,
    levelId: number
): PromiseResult<void, string> {
    try {
        const response = await ctx.authApi.get(
            ApiRoutes.Level.DOWNLOAD_LEVEL(levelId),
            {
                responseType: "blob",
            }
        );

        const blob = await response.data;
        const base64 = await blobToBase64(blob);

        const result = await importLevel(levelId, base64);
        if (!result.ok) {
            return failure("Failed to import level");
        }

        return success();
    } catch (err) {
        return commonApiErrorResult(err);
    }
}
