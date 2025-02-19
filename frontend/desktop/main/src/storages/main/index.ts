import Store from "electron-store";
import { UserInfoSubStorage } from "./user";
import { SavedLevelsSubStorage } from "./savedLevels";
import { SavedLevelDraftsSubStorage } from "./savedLevelDrafts";

export class MainStorage {
    private store: Store<any> = new Store({
        defaults: {
            savedLevels: [],
            savedLevelDrafts: [],
        },
    });

    readonly userInfo = new UserInfoSubStorage(this.store);
    readonly savedLevels = new SavedLevelsSubStorage(this.store);
    readonly savedLevelDrafts = new SavedLevelDraftsSubStorage(this.store);
}
