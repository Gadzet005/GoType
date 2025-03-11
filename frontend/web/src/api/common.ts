import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
    getAccessToken,
    getAuthTokens,
    storeAuthTokens,
    clearAuthTokens,
} from "../auth";

export interface Result<T, E> {
    ok: boolean;
    payload?: T;
    error?: E;
}

export type PromiseResult<T, E> = Promise<Result<T, E>>;

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const host = axios.create({
    baseURL: backendURL,
});

export const authHost = axios.create({
    baseURL: backendURL,
});

const authInterceptor = async (config: InternalAxiosRequestConfig) => {
    const access_token = await getAccessToken();
    if (!access_token) {
        console.error("access token not found");
        return config;
    }

    config.headers.setAuthorization("Bearer " + access_token);
    return config;
};

const authErrorHandler = async (error: AxiosError) => {
    if (error.status === 401) {
        const tokens = await getAuthTokens();
        if (!tokens) {
            console.error("Tokens not found");
            return Promise.reject(error);
        }

        const { accessToken, refreshToken } = tokens;

        try {
            const response = await host.post("/auth/refresh", {
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            await storeAuthTokens({
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
            });

            return authHost.request(error.config!);
        } catch (error: any) {
            await clearAuthTokens();
            // window.location.reload();

            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
};

authHost.interceptors.request.use(authInterceptor);
authHost.interceptors.response.use(
    (response) => response,
    (error) => authErrorHandler(error)
);
