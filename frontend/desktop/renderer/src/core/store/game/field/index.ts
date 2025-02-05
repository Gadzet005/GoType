import { Sentence } from "@desktop-common/sentence";
import { GameFieldSentence } from "./sentence";
import { Queue } from "@datastructures-js/queue";
import { Language } from "@desktop-common/language";
import {
    action,
    computed,
    makeAutoObservable,
    makeObservable,
    observable,
} from "mobx";
import { IGameField } from "./interface";
import { FieldCursor } from "./cursor";

export class GameField implements IGameField {
    private completeSentences = makeAutoObservable(
        new Queue<GameFieldSentence>()
    );
    private activeSentences = makeAutoObservable(
        new Queue<GameFieldSentence>()
    );
    private sentenceIdIncrement = 0;
    readonly cursor: FieldCursor;

    constructor(lang: Language) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            completeSentences: observable,
            activeSentences: observable,
            cursor: observable,

            hasActiveSentences: computed,

            completeCurrentSentence: action,
            addSentence: action,
            removeSentence: action,
            removeAllSentences: action,
        });
        this.cursor = new FieldCursor(this, lang);
    }

    get hasActiveSentences(): boolean {
        return !this.activeSentences.isEmpty();
    }

    getAllSentences(): GameFieldSentence[] {
        return this.completeSentences
            .toArray()
            .concat(this.activeSentences.toArray());
    }

    getCurrentSentence(): GameFieldSentence | null {
        return this.activeSentences.isEmpty()
            ? null
            : this.activeSentences.front();
    }

    completeCurrentSentence(): void {
        if (!this.activeSentences.isEmpty()) {
            const sentence = this.activeSentences.pop();
            this.completeSentences.push(sentence);
        }
    }

    addSentence(sentence: Sentence): void {
        const sentenceId = this.sentenceIdIncrement++;
        this.activeSentences.push(new GameFieldSentence(sentenceId, sentence));
        this.cursor.normalize();
    }

    removeSentence(): void {
        if (!this.completeSentences.isEmpty()) {
            this.completeSentences.pop();
        } else if (!this.activeSentences.isEmpty()) {
            this.activeSentences.pop();
        }
        this.cursor.normalize();
    }

    removeAllSentences(): void {
        this.activeSentences.clear();
        this.completeSentences.clear();
    }
}
