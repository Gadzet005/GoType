import { Asset } from "@desktop-common/asset";
import { DraftData } from "@desktop-common/draft";
import { action, computed, makeObservable, observable } from "mobx";
import { DraftSentence } from "./draftSentence";
import { StyleClassStore } from "./styleClassStore";
import { Language } from "@/core/utils/language";

export class Draft {
    readonly id: number;
    readonly updateTime: number;
    readonly styleClasses: StyleClassStore;

    private language_!: Language;
    private audio_: Asset | null;
    private background_: {
        asset: Asset | null;
        brightness: number;
    };
    private name_: string;
    private sentences_: DraftSentence[];

    constructor(data: DraftData) {
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
            setBackgroundAsset: action,
            setBackgroundBrightness: action,
            setLanguage: action,

            sentences: computed,
            name: computed,
            audio: computed,
            background: computed,
            language: computed,
        });

        this.id = data.id;
        this.name_ = data.name;
        this.updateTime = data.updateTime;
        this.audio_ = data.audio;
        this.background_ = data.background;
        this.styleClasses = new StyleClassStore(data.styleClasses);
        this.sentences_ = data.sentences.map(
            (s, i) => new DraftSentence(this.styleClasses, i, s)
        );

        if (!this.setLanguage(data.languageCode)) {
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
                        styleClassName: null,
                    })
            );
    }

    setName(name: string) {
        this.name_ = name;
    }

    setAudio(audio: Asset | null) {
        this.audio_ = audio;
    }

    setBackgroundAsset(background: Asset | null) {
        this.background_.asset = background;
    }

    setBackgroundBrightness(brightness: number) {
        this.background_.brightness = brightness;
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
