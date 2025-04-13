export namespace ApiRoutes {
    export namespace Auth {
        const ROOT = "/auth";
        export const SIGN_IN = `${ROOT}/login`;
        export const SIGN_UP = `${ROOT}/register`;
        export const REFRESH_TOKEN = `${ROOT}/refresh`;
    }

    export namespace UserActions {
        const ROOT = "/user-actions";
        export const GET_USER_INFO = `${ROOT}/get-user-info`;
        export const LOGOUT = `${ROOT}/logout`;
    }

    export namespace SingleGame {
        const ROOT = "/single-game";
        export const SEND_RESULTS = `${ROOT}/send-results`;
    }

    export namespace Level {
        const ROOT = "/level";
        export const CREATE_LEVEL = `${ROOT}/create-level`;
        export const DOWNLOAD_LEVEL = `${ROOT}/download-level`;
        export const UPDATE_LEVEL = `${ROOT}/update-level`;
    }
}

export enum ApiError {
    unexpected = "UNEXPECTED",
    userExists = "ERR_USER_EXISTS",
    invalidInput = "ERR_INVALID_INPUT",
    noSuchUser = "ERR_NO_SUCH_USER",
    internal = "ERR_INTERNAL",
    accessTokenWrong = "ERR_ACCESS_TOKEN_WRONG",
    refreshTokenWrong = "ERR_REFRESH_TOKEN_WRONG",
    unauthorized = "ERR_UNAUTHORIZED",
}
