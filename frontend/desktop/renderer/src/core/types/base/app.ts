import { IUser } from "./user";
import { RemoveFirst } from "../utils";
import { AxiosInstance } from "axios";

export interface AppContext {
    readonly user: IUser;
    readonly api: AxiosInstance;
    readonly authApi: AxiosInstance;

    runService<TService extends Service>(
        service: TService,
        ...args: RemoveFirst<Parameters<TService>>
    ): Promise<Awaited<ReturnType<TService>>>;
}

export type Service = (ctx: AppContext, ...args: any) => Promise<any>;
