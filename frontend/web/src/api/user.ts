import { authHost, host, PromiseResult } from "./common";
import { UserProfile } from "../store/user";
import { AuthTokens } from "../auth";
import { AxiosError } from "axios";

export const signIn = async (
    name: string,
    password: string
): PromiseResult<AuthTokens, string> => {
    try {
        const response = await host.post("/auth/login", {
            name: name,
            password: password,
        });

        const data = response.data;

        return {
            ok: true,
            payload: {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            },
        };
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return {
                ok: false,
                error: error.response?.data.message,
            };
        } else {
            console.error("Uknown error: ", error);
            return {
                ok: false,
                error: "Неизвестная ошибка",
            };
        }
    }
};

export const signUp = async (
    name: string,
    password: string
): PromiseResult<AuthTokens, string> => {
    try {
        const response = await host.post("/auth/register", {
            name: name,
            password: password,
        });

        const data = response.data;

        return {
            ok: true,
            payload: {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            },
        };
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return {
                ok: false,
                error: error.response?.data.message,
            };
        } else {
            console.error("Uknown error: ", error);
            return {
                ok: false,
                error: "Неизвестная ошибка",
            };
        }
    }
};

export const logout = async (): Promise<void> => {
    await authHost.post("/user-actions/logout").catch(() => {
        console.error("logout failed");
    });
};

export const getUserInfo = async (): PromiseResult<UserProfile, string> => {
    try {
        const response = await authHost.get("/user-actions/get-user-info");
        const data = response.data;

        return {
            ok: true,
            payload: {
                id: data.id,
                name: data.username,
                accessLevel: data.access,
                banInfo: {
                    reason: data.banReason,
                    expiresAt: Date.parse(data.banTime),
                },
            },
        };
    } catch (error: any) {
        if (error instanceof AxiosError) {
            return {
                ok: false,
                error: error.response?.data.message,
            };
        } else {
            console.error("Uknown error: ", error);
            return {
                ok: false,
                error: "Неизвестная ошибка",
            };
        }
    }
};
