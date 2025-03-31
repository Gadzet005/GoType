import { SentenceInfo } from "@desktop-common/level/sentence";
import { Sentence, SentenceState } from "./sentence";
import { Language } from "@/core/utils/language";
import { makeObservable } from "mobx";
import { Letter } from "./letter";

export enum MoveCursorResult {
    correct,
    incorrect,
    ignore,
}

export interface Cursor {
    sentence: number;
    position: number;
}

export class GameField {
    readonly sentences: Sentence[];
    readonly lang: Language;
    private cursor: Cursor = {
        sentence: 0,
        position: 0,
    };
    private thresholds = {
        outro: 0,
        active: 0,
        intro: 0,
        initial: 0,
    };

    constructor(sentences: SentenceInfo[], lang: Language) {
        makeObservable(this, {});
        this.lang = lang;
        this.sentences = sentences.map((info, idx) => new Sentence(idx, info));
    }

    getSentence(idx: number) {
        return this.sentences[idx];
    }

    getVisibleSentences() {
        return this.sentences.filter((s) => s.isVisible());
    }

    /**
     * Change the state of the first sentence with
     * `SentenceState.outro` to `SentenceState.hidden`
     * */
    hideFirstSentence() {
        if (this.thresholds.outro !== this.thresholds.active) {
            const s = this.sentences[this.thresholds.outro];
            s.state = SentenceState.hidden;
            this.thresholds.outro++;
        }
    }

    /**
     * Change the state of the first sentence with
     * `SentenceState.active` to `SentenceState.outro`
     */
    completeFirstSentence() {
        if (this.thresholds.active !== this.thresholds.intro) {
            const s = this.sentences[this.thresholds.active];
            s.state = SentenceState.outro;
            if (this.cursor.sentence == this.thresholds.active) {
                this.cursor.sentence++;
                this.cursor.position = 0;
                this.normalizeCursor();
            }
            this.thresholds.active++;
        }
    }

    /**
     * Change the state of the first sentence with
     * `SentenceState.intro` to `SentenceState.active`
     */
    activateFirstSentence() {
        if (this.thresholds.intro !== this.thresholds.initial) {
            const s = this.sentences[this.thresholds.intro];
            s.state = SentenceState.active;
            const old = this.thresholds.intro++;
            if (old === this.cursor.sentence) {
                this.normalizeCursor();
            }
        }
    }

    /**
     * Change the state of the first sentence with
     * `SentenceState.initial` to `SentenceState.active`
     */
    showFirstSentence() {
        if (this.thresholds.initial !== this.sentences.length) {
            const s = this.sentences[this.thresholds.initial];
            s.state = SentenceState.intro;
            this.thresholds.initial++;
        }
    }

    private isCursorValid() {
        return (
            this.cursor.sentence < this.thresholds.intro &&
            this.cursor.position < this.sentences[this.cursor.sentence].length
        );
    }

    private move() {
        if (!this.isCursorValid()) {
            return;
        }
        this.cursor.position++;
        if (!this.isCursorValid()) {
            this.cursor.sentence++;
            this.cursor.position = 0;
        }
    }

    private getCurrentLetter(): Letter | null {
        if (!this.isCursorValid()) {
            return null;
        }
        return this.sentences[this.cursor.sentence].getLetter(
            this.cursor.position
        );
    }

    private normalizeCursor() {
        while (this.isCursorValid()) {
            const c = this.getCurrentLetter()!;
            if (this.lang.includes(c.char)) {
                break;
            }
            c.success();
            this.move();
        }
    }

    moveCursor(c: string): MoveCursorResult {
        if (!this.lang.includes(c) || !this.isCursorValid()) {
            return MoveCursorResult.ignore;
        }
        const cur = this.getCurrentLetter()!;
        this.move();
        this.normalizeCursor();

        if (cur.isEqual(c)) {
            cur.success();
            return MoveCursorResult.correct;
        } else {
            cur.mistake();
            return MoveCursorResult.incorrect;
        }
    }

    getCursor(): Cursor | null {
        if (!this.isCursorValid()) {
            return null;
        }
        return this.cursor;
    }
}
