import { requestMock } from "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { User } from "@/core/store/user";
import { LogoutService } from "@/core/services/user/logout";
import { Dummy } from "./dummy";

describe("logout test", () => {
    let user: User;

    beforeEach(() => {
        vi.restoreAllMocks();
        user = new User();
        user.setProfile(Dummy.userProfile);
        user.setTokens(Dummy.authTokens);
    });

    it("positive", async () => {
        requestMock.post.mockResolvedValue({
            data: {},
        });

        const logoutService = new LogoutService(user);
        const result = await logoutService.execute();

        expect(result.ok).toBe(true);
        expect(user.isAuth).toBe(false);
    });

    it("negative", async () => {
        requestMock.post.mockImplementationOnce(() => {
            throw new Error();
        });

        const logoutService = new LogoutService(user);
        const result = await logoutService.execute();

        expect(result.ok).toBe(false);
        expect(user.isAuth).toBe(true);
    });
});
