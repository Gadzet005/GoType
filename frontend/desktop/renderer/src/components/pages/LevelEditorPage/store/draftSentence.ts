import { DraftSentenceInfo } from "@desktop-common/draft/sentence";
import { StyleClassStore } from "./styleClassStore";
import { FieldSentence } from "@/core/store/game/core/fieldSentence";
import { action, makeObservable, observable } from "mobx";

export interface DraftSentenceParams extends DraftSentenceInfo {
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
        info: DraftSentenceInfo
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
        });

        this.idx = idx;
        this.content = info.content;
        this.coord_ = info.coord;
        this.showTime_ = info.showTime;
        this.duration_ = info.duration;
        this.styleClassName_ = info.styleClass;
        this.styleClasses = styleClasses;
    }

    toFieldSentence(): FieldSentence {
        const styleClass = this.getStyleClass();
        const duration = this.duration ?? 0;
        const introDuration = duration * styleClass.introDurationRatio;
        const outroDuration = duration * styleClass.outroDurationRatio;
        const activeDuration = duration - introDuration - outroDuration;

        return new FieldSentence(this.idx, {
            content: this.content,
            showTime: this.showTime ?? 0,
            introDuration,
            activeDuration,
            outroDuration,
            style: {
                coord: this.coord_,
                ...styleClass,
            },
        });
    }

    toDraftSentenceInfo(): DraftSentenceInfo {
        return {
            content: this.content,
            coord: this.coord_,
            showTime: this.showTime_,
            duration: this.duration_,
            styleClass: this.styleClassName_,
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
}
