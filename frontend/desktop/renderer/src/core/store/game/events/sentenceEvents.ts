import { GameField } from "../field";
import { GameEvent } from "./types";

export class SentenceIntroEvent implements GameEvent {
    run(field: GameField) {
        field.showFirstSentence();
    }
}

export class SentenceActiveEvent implements GameEvent {
    run(field: GameField) {
        field.activateFirstSentence();
    }
}

export class SentenceOutroEvent implements GameEvent {
    run(field: GameField) {
        field.completeFirstSentence();
    }
}

export class SentenceHideEvent implements GameEvent {
    run(field: GameField) {
        field.hideFirstSentence();
    }
}
