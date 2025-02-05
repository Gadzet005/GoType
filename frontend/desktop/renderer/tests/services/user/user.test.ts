import "@tests/base/apiMock";
import "@tests/base/electronApiMock";

import { UserService } from "@/core/services/user/userService";
import { User } from "@/core/store/user";
import { ApiRoutes } from "@/core/config/api.config";
import { vi, describe, it, expect, beforeEach } from "vitest";

class TestUserService extends UserService {
    execute(): Promise<any> {
        return Promise.resolve();
    }
}

describe("UserService", () => {
    let user: User;
    let userService: TestUserService;

    beforeEach(() => {
        user = new User();
        userService = new TestUserService(user);
        vi.clearAllMocks();
    });

    it("should add authorization header when tokens are available", async () => {
        const mockConfig = { headers: { setAuthorization: vi.fn() } };
        user.setTokens({
            accessToken: "test-token",
            refreshToken: "refresh-token",
        });

        await userService["authInterceptor"](mockConfig as any);

        expect(mockConfig.headers.setAuthorization).toHaveBeenCalledWith(
            "Bearer test-token"
        );
    });

    it("should not add authorization header when tokens are not available", async () => {
        const mockConfig = { headers: { setAuthorization: vi.fn() } };

        await userService["authInterceptor"](mockConfig as any);

        expect(mockConfig.headers.setAuthorization).not.toHaveBeenCalled();
    });

    it("should handle 401 errors and refresh token", async () => {
        const mockError = { status: 401, config: {} };
        const mockResponse = {
            data: { access_token: "new-token", refresh_token: "new-refresh" },
        };
        user.setTokens({
            accessToken: "old-token",
            refreshToken: "old-refresh",
        });

        vi.spyOn(userService["api"], "post").mockResolvedValue(mockResponse);
        vi.spyOn(userService["api"], "request").mockResolvedValue({});

        await userService["authErrorHandler"](mockError as any);

        expect(userService["api"].post).toHaveBeenCalledWith(
            ApiRoutes.Auth.REFRESH_TOKEN,
            {
                access_token: "old-token",
                refresh_token: "old-refresh",
            }
        );
        expect(user.tokens?.accessToken).toBe("new-token");
        expect(user.tokens?.refreshToken).toBe("new-refresh");
        expect(window.userAPI.storeTokens).toHaveBeenCalledWith(
            "new-token",
            "new-refresh"
        );
        expect(userService["api"].request).toHaveBeenCalledWith(
            mockError.config
        );
    });

    it("should handle failed token refresh", async () => {
        const mockError = { status: 401, config: {} };
        user.setTokens({
            accessToken: "old-token",
            refreshToken: "old-refresh",
        });

        vi.spyOn(userService["api"], "post").mockRejectedValue(
            new Error("Refresh failed")
        );
        vi.spyOn(user, "unauthorize");

        await expect(
            userService["authErrorHandler"](mockError as any)
        ).rejects.toThrow("Refresh failed");

        expect(user.unauthorize).toHaveBeenCalled();
        expect(window.userAPI.clearTokens).toHaveBeenCalled();
    });
});
