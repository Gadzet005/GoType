import { action, computed, makeObservable, observable } from "mobx";

export class ActiveSentences {
    private ids_ = new Set<number>();

    constructor() {
        makeObservable(this, {
            // @ts-expect-error
            ids_: observable.shallow,

            add: action,
            remove: action,
            clear: action,
            ids: computed,
        });
    }

    add(id: number) {
        this.ids_.add(id);
    }

    remove(id: number) {
        this.ids_.delete(id);
    }

    clear() {
        this.ids_.clear();
    }

    has(id: number) {
        return this.ids_.has(id);
    }

    get ids() {
        return Array.from(this.ids_);
    }
}
