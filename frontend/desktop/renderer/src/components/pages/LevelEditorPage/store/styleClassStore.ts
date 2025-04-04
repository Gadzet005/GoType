import { Defaults } from "@/core/config/game.config";
import {
    NamedSentenceStyleClass,
    SentenceStyleClass,
} from "@desktop-common/draft/style";
import { action, makeObservable, observable } from "mobx";

export class StyleClassStore {
    private readonly list: NamedSentenceStyleClass[];

    constructor(list: NamedSentenceStyleClass[] = []) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            list: observable,
            add: action,
            update: action,
            remove: action,
        });
        this.list = list;
    }

    add(name: string, styleClass: SentenceStyleClass): boolean {
        if (this.has(name)) {
            return false;
        }
        this.list.push({
            name,
            ...styleClass,
        });
        return true;
    }

    update(oldName: string, styleClass: NamedSentenceStyleClass): boolean {
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

    get(name: string): SentenceStyleClass {
        return (
            this.list.find((styleClass) => styleClass.name === name) ??
            this.default()
        );
    }

    getAll(): NamedSentenceStyleClass[] {
        return this.list;
    }

    default() {
        return Defaults.sentenceStyleClass;
    }
}
