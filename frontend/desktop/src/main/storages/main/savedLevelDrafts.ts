import { BaseSubStorage } from "./base";

export class SavedLevelDraftsSubStorage extends BaseSubStorage {
    getAll(): number[] {
        return this.store.get("savedLevelDrafts");
    }

    add(levelId: number) {
        const ids = this.getAll();
        if (!ids.includes(levelId)) {
            ids.push(levelId);
            this.store.set("savedLevelDrafts", ids);
        }
    }

    remove(levelId: number) {
        const ids = this.getAll();
        const newIds = ids.filter((id) => id !== levelId);
        this.store.set("savedLevelDrafts", newIds);
    }
}
