import { requestMock } from "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { User } from "@/core/store/user";
import { Dummy } from "../dummy";
import { AppContext, Service } from "@/core/types/base/app";
import { IUser } from "@/core/types/base/user";
import { GlobalAppContext } from "@/core/store/appContext";

export const BaseAuthTests = (
    service: Service,
    serviceArgs: any,
    serviceResult: any
) => {
    let user: IUser;
    let ctx: AppContext;

    beforeEach(() => {
        vi.resetAllMocks();
        user = new User();
        ctx = new GlobalAppContext(user);

        requestMock.post.mockResolvedValue({
            data: serviceResult,
        });
        requestMock.get.mockResolvedValue({
            data: Dummy.getUserProfileResult,
        });
    });

    it("positive", async () => {
        const result = await ctx.runService(service, serviceArgs);

        expect(result.ok).toBe(true);
        expect(user.isAuth).toBe(true);
        expect(user.tokens?.accessToken).toEqual(serviceResult.access_token);
        expect(user.tokens?.refreshToken).toEqual(serviceResult.refresh_token);
        expect(user.profile?.id).toEqual(Dummy.getUserProfileResult.id);
        expect(user.profile?.name).toEqual(Dummy.getUserProfileResult.username);
        expect(user.profile?.accessLevel).toEqual(
            Dummy.getUserProfileResult.access
        );
    });

    it("negative", async () => {
        requestMock.post.mockImplementationOnce(() => {
            throw new Error();
        });
        const result1 = await ctx.runService(service, serviceArgs);
        expect(result1.ok).toBe(false);

        requestMock.get.mockImplementationOnce(() => {
            throw new Error();
        });
        const result2 = await ctx.runService(service, serviceArgs);
        expect(result2.ok).toBe(false);
    });
};
