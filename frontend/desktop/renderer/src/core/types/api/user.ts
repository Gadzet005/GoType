import { ApiError } from "../../config/api.config";

export namespace SignIn {
    export interface Args {
        name: string;
        password: string;
    }

    export interface Result {
        access_token: string;
        refresh_token: string;
    }

    export type Error =
        | ApiError.invalidInput
        | ApiError.noSuchUser
        | ApiError.internal;
}

export namespace SignUp {
    export type Args = SignIn.Args;
    export type Result = SignIn.Result;
    export type Error =
        | ApiError.invalidInput
        | ApiError.userExists
        | ApiError.internal;
}

export namespace Refresh {
    export interface Args {
        access_token: string;
        refresh_token: string;
    }
    export interface Result {
        access_token: string;
        refresh_token: string;
    }
    export type Error =
        | ApiError.invalidInput
        | ApiError.noSuchUser
        | ApiError.accessTokenWrong
        | ApiError.refreshTokenWrong
        | ApiError.unauthorized
        | ApiError.internal;
}

export namespace GetUserInfo {
    export type Args = void;

    export interface Result {
        access: number;
        ban_reason: string;
        ban_time: string;
        id: number;
        username: string;
    }

    export type Error =
        | ApiError.accessTokenWrong
        | ApiError.unauthorized
        | ApiError.noSuchUser
        | ApiError.unauthorized
        | ApiError.internal;
}

export namespace Logout {
    export type Args = void;
    export type Result = void;

    export type Error =
        | ApiError.accessTokenWrong
        | ApiError.noSuchUser
        | ApiError.unauthorized
        | ApiError.internal;
}
