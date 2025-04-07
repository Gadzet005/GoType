import Store from "electron-store";

export abstract class BaseSubStorage {
    protected store: Store<any>;

    constructor(store: Store<any>) {
        this.store = store;
    }
}
