import { AppConfig } from "../common/config";

export interface InternalAppConfig extends AppConfig {
    devRendererURL: string;
}

export const appConfig: InternalAppConfig = {
    backendURL: "http://localhost:8080",
    devRendererURL: "http://localhost:3000",
    isDev: Boolean(process.env.ELECTRON_IS_DEV ?? false),
};
