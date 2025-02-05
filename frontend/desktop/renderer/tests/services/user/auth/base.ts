import { requestMock } from "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { User } from "@/core/store/user";
import { UserService } from "@/core/services/user/userService";
import { Dummy } from "../dummy";

export const BaseAuthTests = (
    ServiceClass: new (user: User) => UserService,
    serviceArgs: any,
    serviceResult: any
) => {
    let user: User;
    let service: UserService;

    beforeEach(() => {
        vi.resetAllMocks();
        user = new User();
        service = new ServiceClass(user);

        requestMock.post.mockResolvedValue({
            data: serviceResult,
        });
        requestMock.get.mockResolvedValue({
            data: Dummy.getUserProfileResult,
        });
    });

    it("positive", async () => {
        const result = await service.execute(serviceArgs);

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
        const result1 = await service.execute(serviceArgs);
        expect(result1.ok).toBe(false);

        requestMock.get.mockImplementationOnce(() => {
            throw new Error();
        });
        const result2 = await service.execute(serviceArgs);
        expect(result2.ok).toBe(false);
    });
};
