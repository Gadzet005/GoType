import { ApiRoutes } from "@/core/config/api.config";
import { GameStatistics } from "@/core/store/game/statistics";
import { SendSingleGameResults } from "@/core/types/api/game";
import { AppContext } from "@/core/types/base/app";
import {
    commonApiErrorResult,
    PromiseResult,
    success,
} from "@/core/types/result";

export async function sendGameResults(
    ctx: AppContext,
    levelId: number,
    stat: GameStatistics
): PromiseResult<void, string> {
    try {
        const alphabetStat = stat.alphabetStat.reduce(
            (acc, { letter, total, mistakes }) => {
                acc[letter] = [total, mistakes];
                return acc;
            },
            {} as Record<string, [number, number]>
        );

        await ctx.authApi.post(ApiRoutes.SingleGame.SEND_RESULTS, {
            level_id: levelId,
            player_id: ctx.user.profile!.id,
            max_combo: stat.maxCombo,
            average_velocity: stat.avgVelocity,
            placement: 1,
            points: stat.score,
            num_press_err_by_char: alphabetStat,
        } as SendSingleGameResults.Args);

        return success();
    } catch (err) {
        return commonApiErrorResult(err);
    }
}
