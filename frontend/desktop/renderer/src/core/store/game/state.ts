import { Language } from "@desktop-common/language";
import { Sentence } from "@desktop-common/sentence";
import { action, makeObservable, observable } from "mobx";
import { EventStorage } from "./events/storage";
import { AddSentenceEvent } from "./events/wordEvents";
import { GameField } from "./field";

export class GameState {
    readonly events = new EventStorage();
    readonly field: GameField;

    constructor(lang: Language) {
        makeObservable(this, {
            field: observable,
            events: observable,
            init: action,
        });
        this.field = new GameField(lang);
    }

    init(sentences: Sentence[]) {
        this.events.removeAllEvents();
        this.field.removeAllSentences();
        sentences.forEach((sentence) => {
            this.events.addEvent(
                sentence.showTime,
                new AddSentenceEvent(sentence)
            );
        });
    }
}
