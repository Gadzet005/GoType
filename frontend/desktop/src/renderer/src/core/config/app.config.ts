import { AppConfig } from "@common/config";

export let appConfig: AppConfig;

export async function loadConfig() {
    appConfig = await window.appAPI.getConfig();
}
