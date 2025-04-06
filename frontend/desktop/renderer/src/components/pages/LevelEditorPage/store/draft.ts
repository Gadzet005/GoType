import { NamedAsset } from "@desktop-common/asset";
import { DraftInfo } from "@desktop-common/draft";
import { action, computed, makeObservable, observable } from "mobx";
import { DraftSentence } from "./draftSentence";
import { StyleClassStore } from "./styleClassStore";
import { Language } from "@/core/utils/language";

export class Draft {
    readonly id: number;
    readonly updateTime: number;
    readonly styleClasses: StyleClassStore;

    private language_!: Language;
    private audio_: NamedAsset | null;
    private background_: NamedAsset | null;
    private name_: string;
    private sentences_: DraftSentence[];

    constructor(info: DraftInfo) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            sentences_: observable.shallow,
            name_: observable,
            audio_: observable.ref,
            background_: observable.ref,
            language_: observable.ref,

            setSentencesByText: action,
            setName: action,
            setAudio: action,
            setBackground: action,
            setLanguage: action,

            sentences: computed,
            name: computed,
            audio: computed,
            background: computed,
            language: computed,
        });

        this.id = info.id;
        this.name_ = info.name;
        this.updateTime = info.updateTime;
        this.audio_ = info.audio;
        this.background_ = info.background;
        this.styleClasses = new StyleClassStore(info.styleClasses);
        this.sentences_ = info.sentences.map(
            (s, i) => new DraftSentence(this.styleClasses, i, s)
        );

        if (!this.setLanguage(info.languageCode)) {
            this.setLanguage("eng");
        }
    }

    setSentencesByText(text: string) {
        this.sentences_ = text
            .split("\n")
            .filter((line) => line !== "")
            .map(
                (line, i) =>
                    new DraftSentence(this.styleClasses, i, {
                        content: line,
                        coord: { x: 0, y: 0 },
                        showTime: null,
                        duration: null,
                        styleClass: null,
                    })
            );
    }

    setName(name: string) {
        this.name_ = name;
    }

    setAudio(audio: NamedAsset | null) {
        this.audio_ = audio;
    }

    setBackground(background: NamedAsset | null) {
        this.background_ = background;
    }

    setLanguage(code: string): boolean {
        const lang = Language.byCode(code);
        if (!lang) {
            return false;
        }
        this.language_ = lang;
        return true;
    }

    get sentences() {
        return this.sentences_;
    }

    get name() {
        return this.name_;
    }

    get audio() {
        return this.audio_;
    }

    get background() {
        return this.background_;
    }

    get language() {
        return this.language_;
    }
}
