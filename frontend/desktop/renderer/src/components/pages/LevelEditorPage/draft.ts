import { NamedAsset } from "@desktop-common/asset";
import { DraftInfo } from "@desktop-common/draft";
import { DraftSentenceInfo } from "@desktop-common/draft/sentence";
import {
    NamedSentenceStyleClass,
    SentenceStyleClass,
} from "@desktop-common/draft/style";
import { action, computed, makeAutoObservable, observable } from "mobx";

export class Draft {
    private info!: Omit<DraftInfo, "styleClasses">;
    private styleClasses_ = new Map<string, SentenceStyleClass>();

    constructor(info: DraftInfo) {
        makeAutoObservable(this, {
            // @ts-expect-error: private observable
            info: observable,
            styleClasses_: observable,

            addStyleClass: action,
            removeStyleClass: action,
            setStyleClass: action,

            id: computed,
            name: computed,
            updateTime: computed,
            audio: computed,
            background: computed,
            sentences: computed,
            styleClasses: computed,
        });

        this.init(info);
    }

    init(info: DraftInfo) {
        this.styleClasses_.clear();
        info.styleClasses.forEach((styleClass) => {
            this.styleClasses_.set(styleClass.name, styleClass);
        });
        this.info = info;
    }

    setName(name: string) {
        this.info.name = name;
    }

    addStyleClass(name: string, styleClass: SentenceStyleClass): boolean {
        if (this.styleClasses_.has(name)) {
            return false;
        }
        this.styleClasses_.set(name, styleClass);
        return true;
    }

    setStyleClass(name: string, styleClass: SentenceStyleClass) {
        this.styleClasses_.set(name, styleClass);
    }

    removeStyleClass(name: string): boolean {
        return this.styleClasses_.delete(name);
    }

    setAudio(asset: NamedAsset | null) {
        this.info.audio = asset;
    }

    setBackground(asset: NamedAsset | null) {
        this.info.background = asset;
    }

    get id(): number {
        return this.info.id;
    }

    get name(): string {
        return this.info.name;
    }

    get updateTime(): number {
        return this.info.updateTime;
    }

    get audio(): NamedAsset | null {
        return this.info.audio;
    }

    get background(): NamedAsset | null {
        return this.info.background;
    }

    get sentences(): DraftSentenceInfo[] {
        return this.info.sentences;
    }

    get styleClasses(): NamedSentenceStyleClass[] {
        return Array.from(this.styleClasses_, ([key, value]) => ({
            name: key,
            ...value,
        }));
    }
}
