import { DraftData } from "@common/draft";
import { makeObservable, observable } from "mobx";
import { DraftSentence } from "./draftSentence";
import { StyleClassStore } from "./styleClassStore";
import { Language } from "@/core/utils/language";

export class Draft {
    readonly id: number;
    readonly updateTime: number;
    readonly styleClasses: StyleClassStore;
    readonly language: Language;
    readonly name: string;
    readonly sentences: DraftSentence[];
    readonly publication: DraftData["publication"];
    readonly audio: DraftData["audio"];
    readonly background: DraftData["background"];

    constructor(data: DraftData) {
        makeObservable(this, {
            sentences: observable.shallow,
        });

        this.id = data.id;
        this.name = data.name;
        this.updateTime = data.updateTime;
        this.audio = data.audio;
        this.background = data.background;
        this.styleClasses = new StyleClassStore(data.styleClasses);
        this.sentences = data.sentences.map(
            (s, i) => new DraftSentence(this.styleClasses, i, s)
        );
        this.publication = data.publication;

        this.language =
            Language.byCode(data.languageCode) ?? Language.byCode("en")!;
    }
}
