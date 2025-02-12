import { requestMock } from "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { GlobalAppContext } from "@/core/store/appContext";
import { AppContext } from "@/core/types/base/app";
import { ApiError } from "@/core/config/api.config";
import { loadUserProfile } from "../loadUserProfile";
import { Dummy } from "./dummy";
import { UserDummy } from "@tests/dummy/user";

describe("LoadUserProfile tests", () => {
    let ctx: AppContext;

    beforeEach(() => {
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ctx.user.setTokens(UserDummy.authTokens);
        requestMock.get.mockResolvedValue({
            data: Dummy.getUserProfileResult,
        });

        const result = await ctx.runService(loadUserProfile);

        expect(result.ok).toBe(true);
        expect(ctx.user.isAuth).toBe(true);
        expect(ctx.user.profile?.id).toBe(Dummy.getUserProfileResult.id);
        expect(ctx.user.profile?.name).toBe(
            Dummy.getUserProfileResult.username
        );
        expect(ctx.user.profile?.accessLevel).toBe(
            Dummy.getUserProfileResult.access
        );
    });

    it("negative", async () => {
        requestMock.get.mockRejectedValue({
            response: {
                status: 401,
                data: { message: ApiError.unauthorized },
            },
        });

        const result = await ctx.runService(loadUserProfile);

        expect(result.ok).toBe(false);
        expect(result.error).toBe(ApiError.unauthorized);
    });
});
