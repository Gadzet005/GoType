import { requestMock } from "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { GlobalAppContext } from "@/core/store/appContext";
import { AppContext } from "@/core/types/base/app";
import { ApiError } from "@/core/config/api.config";
import { getUserProfile } from "../getUserProfile";
import { Dummy } from "./dummy";
import { UserDummy } from "@tests/creation/user";

describe("LoadUserProfile tests", () => {
    const config = {
        backendURL: "",
        isDev: true,
    };
    let ctx: AppContext;

    beforeEach(() => {
        ctx = new GlobalAppContext(config);
    });

    it("positive", async () => {
        ctx.user.setTokens(UserDummy.authTokens);
        requestMock.get.mockResolvedValue({
            data: Dummy.getUserProfileResult,
        });

        const result = await getUserProfile(ctx);

        expect(result.ok).toBe(true);
        if (result.ok) {
            const profile = result.payload;
            expect(profile.id).toBe(Dummy.getUserProfileResult.id);
            expect(profile.name).toBe(Dummy.getUserProfileResult.username);
            expect(profile.accessLevel).toBe(Dummy.getUserProfileResult.access);
        }
    });

    it("negative", async () => {
        requestMock.get.mockRejectedValue({
            response: {
                status: 401,
                data: { message: ApiError.unauthorized },
            },
        });

        const result = await getUserProfile(ctx);

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe(ApiError.unauthorized);
        }
    });
});
