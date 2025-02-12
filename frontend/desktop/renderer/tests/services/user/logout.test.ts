import { requestMock } from "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { logout } from "@/core/services/api/user/logout";
import { UserDummy } from "@tests/base/dummy";
import { GlobalAppContext } from "@/core/store/appContext";
import { AppContext } from "@/core/types/base/app";
import { IUser } from "@/core/types/base/user";

describe("logout test", () => {
    let user: IUser;
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        user = UserDummy.create(true);
        ctx = new GlobalAppContext(user);
    });

    it("positive", async () => {
        requestMock.post.mockResolvedValue({
            data: {},
        });

        const result = await ctx.runService(logout);

        expect(result.ok).toBe(true);
        expect(user.isAuth).toBe(false);
    });

    it("negative", async () => {
        requestMock.post.mockImplementationOnce(() => {
            throw new Error();
        });

        const result = await ctx.runService(logout);

        expect(result.ok).toBe(false);
        expect(user.isAuth).toBe(true);
    });
});
