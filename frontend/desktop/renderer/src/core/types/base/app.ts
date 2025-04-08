import { IUser } from "./user";
import { AxiosInstance } from "axios";

export interface AppContext {
    readonly user: IUser;
    readonly api: AxiosInstance;
    readonly authApi: AxiosInstance;
}

export type Service = (...args: any) => Promise<any>;
