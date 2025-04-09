import config from "./config.json";
import { AppConfig } from "../common/config";

export interface InternalAppConfig extends AppConfig {
    devRendererURL: string;
}

export const appConfig: InternalAppConfig = {
    backendURL: config.backendURL,
    devRendererURL: config.devRendererURL,
    isDev: Boolean(process.env.ELECTRON_IS_DEV ?? false),
};
