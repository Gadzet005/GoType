import axios, { AxiosInstance } from "axios";
import { BACKEND_URL } from "@/config/api.config";
import { Service } from "./service";

export abstract class ApiService implements Service {
    protected api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: BACKEND_URL,
        });
    }

    abstract execute(args: any): Promise<any>;
}