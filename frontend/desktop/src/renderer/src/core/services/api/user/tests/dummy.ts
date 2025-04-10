import { GetUserInfo, Refresh, SignIn, SignUp } from "@/core/types/api/user";
import { AxiosError } from "axios";

export namespace Dummy {
    export const signInArgs: SignIn.Args = {
        name: "test",
        password: "test",
    };

    export const signUpArgs: SignUp.Args = signInArgs;

    export const signInResult: SignIn.Result = {
        access_token: "access_token",
        refresh_token: "refresh_token",
    };

    export const signUpResult = signInResult;

    export const getUserProfileResult: GetUserInfo.Result = {
        access: 1,
        ban_reason: "",
        ban_time: "",
        id: 1,
        username: "testUser",
    };

    export const refreshArgs: Refresh.Args = {
        access_token: "access_token",
        refresh_token: "refresh_token",
    };

    export const UnauthorizedError = (config: any) => {
        return new AxiosError("Unauthorized", "401", undefined, undefined, {
            status: 401,
            statusText: "Unauthorized",
            data: {
                statusText: "Unauthorized",
                message: "Unauthorized",
            },
            headers: {},
            config: config,
        });
    };
}
