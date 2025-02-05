import { ApiRoutes, BACKEND_URL } from "@/core/config/api.config";
import { User } from "@/core/store/user";
import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";
import { ApiService } from "../base/apiService";

/**
 * Abstract class representing a user service with authentication handling.
 */
export abstract class UserService extends ApiService {
    protected user: User;
    protected authApi: AxiosInstance;

    constructor(user: User) {
        super();
        this.user = user;

        this.authApi = axios.create({
            baseURL: BACKEND_URL,
        });
        this.authApi.interceptors.request.use(this.authInterceptor);
        this.authApi.interceptors.response.use(
            (response) => response,
            (error) => this.authErrorHandler(error)
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

        try {
            const response = await this.api.post(ApiRoutes.Auth.REFRESH_TOKEN, {
                access_token: this.user.tokens?.accessToken,
                refresh_token: this.user.tokens?.refreshToken,
            });

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
