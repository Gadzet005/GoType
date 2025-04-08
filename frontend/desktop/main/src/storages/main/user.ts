import { UserInfo } from "@desktop-common/user";
import { BaseSubStorage } from "./base";

export class UserInfoSubStorage extends BaseSubStorage {
    save(userInfo: UserInfo) {
        this.store.set("userInfo", userInfo);
    }

    clear() {
        this.store.delete("userInfo");
    }

    get(): UserInfo | null {
        return this.store.get("userInfo", null);
    }
}
