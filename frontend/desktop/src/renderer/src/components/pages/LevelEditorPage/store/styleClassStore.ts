import { Defaults } from "@/core/config/game.config";
import { NamedStyleClass, StyleClass } from "@/core/types/game";
import { action, makeObservable, observable } from "mobx";

export class StyleClassStore {
    private readonly list: NamedStyleClass[];

    constructor(list: NamedStyleClass[] = []) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            list: observable,
            add: action,
            update: action,
            remove: action,
        });
        this.list = list;
    }

    add(name: string, styleClass: StyleClass): boolean {
        if (this.has(name)) {
            return false;
        }
        this.list.push({
            name,
            ...styleClass,
        });
        return true;
    }

    update(oldName: string, styleClass: NamedStyleClass): boolean {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].name === oldName) {
                this.list[i] = styleClass;
                return true;
            }
        }
        return false;
    }

    remove(name: string): boolean {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].name === name) {
                this.list.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    has(name: string): boolean {
        return this.list.some((styleClass) => styleClass.name === name);
    }

    get(name: string | null): StyleClass {
        if (name === null) {
            return this.default();
        }
        return (
            this.list.find((styleClass) => styleClass.name === name) ??
            this.default()
        );
    }

    getAll(): NamedStyleClass[] {
        return this.list;
    }

    default() {
        return Defaults.sentenceStyleClass;
    }
}
