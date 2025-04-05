export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
}

export enum ApiError {
    unexpected = "UNEXPECTED",
    userExists = "ERR_USER_EXISTS",
    invalidInput = "ERR_INVALID_INPUT",
    wrongToken = "ERR_ACCESS_TOKEN_WRONG",
    noSuchUser = "ERR_NO_SUCH_USER",
}