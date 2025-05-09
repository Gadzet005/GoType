import { requestMock } from "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { GlobalAppContext } from "@/core/store/appContext";
import { AppContext } from "@/core/types/base/app";
import { refresh } from "../refresh";
import { Refresh } from "@/core/types/api/user";
import { UserDummy } from "@tests/creation/user";

describe("Refresh tests", () => {
    const config = {
        backendURL: "",
        isDev: true,
    };
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext(config, UserDummy.create(true));
    });

    it("positive", async () => {
        requestMock.post.mockResolvedValue({
            data: {
                access_token: "access_token",
                refresh_token: "refresh_token",
            } as Refresh.Args,
        });

        const result = await refresh(ctx);
        expect(result.ok).toBe(true);
        expect(ctx.user.isAuth).toBe(true);
        expect(ctx.user.tokens?.accessToken).toBe("access_token");
        expect(ctx.user.tokens?.refreshToken).toBe("refresh_token");
    });

    it("negative", async () => {
        requestMock.post.mockRejectedValue({
            response: {
                status: 500,
                data: { message: "Refresh failed" },
            },
        });

        const result = await refresh(ctx);
        expect(result.ok).toBe(false);
        expect(ctx.user.isAuth).toBe(false);
    });
});
