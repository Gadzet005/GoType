import { AppConfig } from "@desktop-common/config";
import { IUser } from "./user";
import { AxiosInstance } from "axios";

export interface AppContext {
    readonly user: IUser;
    readonly api: AxiosInstance;
    readonly authApi: AxiosInstance;
    readonly config: AppConfig;
}

export type Service = (...args: any) => Promise<any>;
