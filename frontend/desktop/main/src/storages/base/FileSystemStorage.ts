import { MainStorage } from "../main";
import { FSJetpack } from "fs-jetpack/types";
import * as jetpack from "fs-jetpack";

export abstract class FileSystemStorage {
    readonly root: FSJetpack;
    protected mainStorage: MainStorage;

    constructor(mainStorage: MainStorage, root: string) {
        this.root = jetpack.dir(root);
        this.mainStorage = mainStorage;
    }
}
