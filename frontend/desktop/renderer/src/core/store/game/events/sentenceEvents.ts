import { GameField } from "../field";
import { GameEvent } from "./types";

enum SentenceEventPriorities {
    Intro = 4,
    Active = 3,
    Outro = 2,
    Hide = 1,
}

export class SentenceIntroEvent implements GameEvent {
    run(field: GameField) {
        field.showFirstSentence();
    }

    priority() {
        return SentenceEventPriorities.Intro;
    }
}

export class SentenceActiveEvent implements GameEvent {
    run(field: GameField) {
        field.activateFirstSentence();
    }

    priority() {
        return SentenceEventPriorities.Active;
    }
}

export class SentenceOutroEvent implements GameEvent {
    run(field: GameField) {
        field.completeFirstSentence();
    }

    priority() {
        return SentenceEventPriorities.Outro;
    }
}

export class SentenceHideEvent implements GameEvent {
    run(field: GameField) {
        field.hideFirstSentence();
    }

    priority() {
        return SentenceEventPriorities.Hide;
    }
}
