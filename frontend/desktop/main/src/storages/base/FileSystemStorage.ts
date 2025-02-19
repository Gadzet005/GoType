import { ignoreCode } from "@/utils/common";
import fs from "fs/promises";
import { MainStorage } from "../main";

export abstract class FileSystemStorage {
    readonly dir: string;
    protected mainStorage: MainStorage;

    constructor(mainStorage: MainStorage, dir: string) {
        this.dir = dir;
        this.mainStorage = mainStorage;
    }

    async init() {
        await fs
            .mkdir(this.dir, { recursive: true })
            .catch(ignoreCode("EEXIST"));
    }
}
