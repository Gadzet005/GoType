import { Sentence } from "@desktop-common/sentence";
import { GameState } from "../state";
import { GameEvent } from "./interface";

export class RemoveSentenceEvent implements GameEvent {
    run(state: GameState) {
        state.field.removeSentence();
    }
}

export class AddSentenceEvent implements GameEvent {
    private sentence: Sentence;

    constructor(sentence: Sentence) {
        this.sentence = sentence;
    }

    run(state: GameState) {
        state.field.addSentence(this.sentence);
        state.events.addEvent(
            this.sentence.showTime + this.sentence.duration,
            new RemoveSentenceEvent()
        );
    }
}
