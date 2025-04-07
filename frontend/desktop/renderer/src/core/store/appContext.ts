import { AppContext } from "@/core/types/base/app";
import { User } from "./user";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refresh } from "../services/api/user/refresh";
import { action, makeObservable, observable } from "mobx";
import { IUser } from "../types/base/user";
import { AppConfig } from "@desktop-common/config";

export class GlobalAppContext implements AppContext {
    readonly user: AppContext["user"];
    readonly api: AppContext["api"];
    readonly authApi: AppContext["authApi"];
    readonly config: AppContext["config"];

    constructor(config: AppConfig, user?: IUser) {
        makeObservable(this, {
            user: observable,

            // @ts-expect-error private actions
            authInterceptor: action,
            authErrorHandler: action,
        });

        this.config = config;
        this.user = user || new User();
        this.api = axios.create({
            baseURL: config.backendURL,
        });
        this.authApi = axios.create({
            baseURL: config.backendURL,
        });
        this.authApi.interceptors.request.use(this.authInterceptor);
        this.authApi.interceptors.response.use(
            (response) => response,
            this.authErrorHandler
        );
    }

    private authInterceptor = async (config: InternalAxiosRequestConfig) => {
        if (this.user.tokens) {
            config.headers.setAuthorization(
                "Bearer " + this.user.tokens.accessToken
            );
        }
        return config;
    };

    private authErrorHandler = async (error: AxiosError) => {
        if (error.status !== 401 || !this.user.tokens) {
            return Promise.reject(error);
        }

        const result = await refresh(this);
        if (result.ok) {
            return this.authApi.request(error.config!);
        }

        return Promise.reject(error);
    };
}
