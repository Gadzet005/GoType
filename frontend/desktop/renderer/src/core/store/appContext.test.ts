import "@tests/base/apiMock";

import { UserDummy } from "@tests/dummy/user";
import { GlobalAppContext } from "./appContext";
import { AxiosHeaders, AxiosRequestConfig } from "axios";
import { AppContext } from "../types/base/app";

describe("GlobalAppContext tests", () => {
    let ctx: AppContext;

    beforeEach(() => {
        ctx = new GlobalAppContext(UserDummy.create(true));
    });

    it("should initialize user with default values when no user is provided", async () => {
        const newContext = new GlobalAppContext();
        expect(newContext.user).not.toBeUndefined();
        expect(newContext.api).not.toBeUndefined();
        expect(newContext.authApi).not.toBeUndefined();
        expect(newContext.user.isAuth).toBe(false);
    });

    it("should set authorization headers in requests", async () => {
        const config = {
            headers: new AxiosHeaders(),
        } as AxiosRequestConfig;

        // @ts-expect-error for testing purposes
        ctx.authInterceptor(config);

        expect(config.headers!.Authorization).toBe(
            "Bearer " + UserDummy.authTokens.accessToken
        );
    });
});
