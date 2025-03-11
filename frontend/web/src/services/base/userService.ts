import { ApiRoutes, BACKEND_URL } from "@/config/api.config";
import { User } from "@/store/user";
import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";
import { ApiService } from "./apiService";

export abstract class UserService extends ApiService {
    protected user: User;
    protected authApi: AxiosInstance;

    constructor(user: User) {
        super();
        this.user = user;

        this.authApi = axios.create({
            baseURL: BACKEND_URL,
        });

        const authInterceptor = this.createAuthInterceptor();
        const authErrorHandler = this.createAuthErrorHandler();

        this.authApi.interceptors.request.use(authInterceptor);
        this.authApi.interceptors.response.use(
            (response) => response,
            (error) => authErrorHandler(error)
        );
    }

    private createAuthInterceptor() {
        return async (config: InternalAxiosRequestConfig) => {
            if (this.user.tokens) {
                config.headers.setAuthorization(
                    "Bearer " + this.user.tokens?.accessToken
                );
            }
            return config;
        };
    }

    private createAuthErrorHandler() {
        return async (error: AxiosError) => {
            if (error.status !== 401 || !this.user.tokens) {
                return Promise.reject(error);
            }

            try {
                console.log(this.user.tokens);
                const response = await this.api.post(
                    ApiRoutes.Auth.REFRESH_TOKEN,
                    {
                        access_token: this.user.tokens?.accessToken,
                        refresh_token: this.user.tokens?.refreshToken,
                    }
                );

                const accessToken = response.data.access_token;
                const refreshToken = response.data.refresh_token;

                this.user.setTokens({
                    accessToken,
                    refreshToken,
                });
                await window.userAPI.storeTokens(accessToken, refreshToken);

                return this.api.request(error.config!);
            } catch (error: any) {
                this.user.unauthorize();
                await window.userAPI.clearTokens();

                return Promise.reject(error);
            }
        };
    }
}