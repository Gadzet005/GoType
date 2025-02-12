import { AppContext, Service } from "@/core/types/base/app";
import { User } from "./user";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BACKEND_URL } from "@/core/config/api.config";
import { RemoveFirst } from "@/core/types/utils";
import { refresh } from "../services/api/user/refresh";
import { action, makeObservable, observable } from "mobx";
import { IUser } from "../types/base/user";

export class GlobalAppContext implements AppContext {
    readonly user: AppContext["user"];
    readonly api: AppContext["api"];
    readonly authApi: AppContext["authApi"];

    constructor(user?: IUser) {
        makeObservable(this, {
            user: observable,
            runService: action,

            // @ts-expect-error private actions
            authInterceptor: action,
            authErrorHandler: action,
        });

        this.user = user || new User();
        this.api = axios.create({
            baseURL: BACKEND_URL,
        });
        this.authApi = axios.create({
            baseURL: BACKEND_URL,
        });
        this.authApi.interceptors.request.use(this.authInterceptor);
        this.authApi.interceptors.response.use(
            (response) => response,
            this.authErrorHandler
        );
    }

    runService<TService extends Service>(
        service: TService,
        ...args: RemoveFirst<Parameters<TService>>
    ): Promise<Awaited<ReturnType<TService>>> {
        return service(this, ...args);
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

        const result = await this.runService(refresh);
        if (result.ok) {
            return this.authApi.request(error.config!);
        }

        return Promise.reject(error);
    };
}
