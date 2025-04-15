import { DraftSentenceData } from "@common/draft/sentence";
import { StyleClassStore } from "./styleClassStore";
import { action, computed, makeObservable, observable } from "mobx";
import { FieldSentence } from "@/core/store/game/core/fieldSentence";
import { SentenceData } from "@common/level/sentence";

export interface DraftSentenceParams extends DraftSentenceData {
    idx: number;
    styleClasses: StyleClassStore;
}

export class DraftSentence {
    readonly idx: number;
    readonly content: string;
    private readonly styleClasses: StyleClassStore;
    private coord_: {
        x: number;
        y: number;
    };
    private showTime_: number | null;
    private duration_: number | null;
    private styleClassName_: string | null;

    constructor(
        styleClasses: StyleClassStore,
        idx: number,
        data: DraftSentenceData
    ) {
        makeObservable(this, {
            // @ts-expect-error: private observable
            coord_: observable.struct,
            showTime_: observable,
            duration_: observable,
            styleClassName_: observable,

            setShowTime: action,
            setDuration: action,
            setCoord: action,
            setStyleClassName: action,

            coord: computed,
            styleClassName: computed,
            showTime: computed,
            duration: computed,
        });

        this.idx = idx;
        this.content = data.content;
        this.coord_ = data.coord;
        this.showTime_ = data.showTime;
        this.duration_ = data.duration;
        this.styleClassName_ = data.styleClassName;
        this.styleClasses = styleClasses;
    }

    toSentenceData(): SentenceData | null {
        if (!this.showTime || !this.duration) {
            return null;
        }

        const styleClass = this.getStyleClass();
        const introDuration = this.duration * styleClass.introDurationRatio;
        const outroDuration = this.duration * styleClass.outroDurationRatio;
        const activeDuration = this.duration - introDuration - outroDuration;

        return {
            content: this.content,
            showTime: this.showTime,
            introDuration,
            activeDuration,
            outroDuration,
            style: {
                coord: this.coord,
                bgcolor: styleClass.bgcolor,
                padding: styleClass.padding,
                rotation: styleClass.rotation,
                borderRadius: styleClass.borderRadius,
                font: styleClass.font,
                fontSize: styleClass.fontSize,
                bold: styleClass.bold,
                colors: styleClass.colors,
            },
        };
    }

    toFieldSentence(): FieldSentence | null {
        const data = this.toSentenceData();
        if (!data) {
            return null;
        }
        return new FieldSentence(this.idx, data);
    }

    toDraftSentenceData(): DraftSentenceData {
        return {
            content: this.content,
            coord: this.coord_,
            showTime: this.showTime_,
            duration: this.duration_,
            styleClassName: this.styleClassName_,
        };
    }

    getStyleClass() {
        if (!this.styleClassName_) {
            return this.styleClasses.default();
        }
        return this.styleClasses.get(this.styleClassName_);
    }

    setShowTime(time: number | null) {
        this.showTime_ = time;
    }

    setDuration(duration: number | null) {
        this.duration_ = duration;
    }

    setCoord(x: number, y: number) {
        this.coord_ = { x, y };
    }

    setStyleClassName(className: string | null) {
        this.styleClassName_ = className;
    }

    get coord() {
        return this.coord_;
    }

    get showTime() {
        return this.showTime_;
    }

    get duration() {
        return this.duration_;
    }

    get styleClassName() {
        return this.styleClassName_;
    }
}
