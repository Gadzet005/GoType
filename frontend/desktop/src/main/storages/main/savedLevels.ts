import { BaseSubStorage } from "./base";

export class SavedLevelsSubStorage extends BaseSubStorage {
    getAll(): number[] {
        return this.store.get("savedLevels");
    }

    add(levelId: number) {
        const ids = this.getAll();
        if (!ids.includes(levelId)) {
            ids.push(levelId);
            this.store.set("savedLevels", ids);
        }
    }

    remove(levelId: number) {
        const ids = this.getAll();
        const newIds = ids.filter((id) => id !== levelId);
        this.store.set("savedLevels", newIds);
    }
}
