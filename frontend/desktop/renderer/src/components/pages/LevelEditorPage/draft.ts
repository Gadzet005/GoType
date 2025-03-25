import { NamedAsset } from "@desktop-common/asset";
import { DraftInfo } from "@desktop-common/draft";
import { DraftSentenceInfo } from "@desktop-common/draft/sentence";
import { StyleClass } from "@desktop-common/draft/style";
import { action, makeAutoObservable, observable } from "mobx";

export class Draft implements DraftInfo {
    private _id!: number;
    private _name!: string;
    private _updateTime!: number;
    private _audio!: NamedAsset | null;
    private _background!: NamedAsset | null;
    private _sentences!: DraftSentenceInfo[];
    private _styleClasses!: StyleClass[];

    constructor(data: DraftInfo) {
        this.update(data);

        makeAutoObservable(this, {
            // @ts-expect-error: private observable
            _id: observable,
            _name: observable,
            _updateTime: observable,
            _audio: observable,
            _background: observable,
            _sentences: observable,
            _styleClasses: observable,
            update: action,
        });
    }

    update(data: Partial<DraftInfo>): void {
        if (data.id) {
            this._id = data.id;
        }
        if (data.name) {
            this._name = data.name;
        }
        if (data.updateTime) {
            this._updateTime = data.updateTime;
        }
        if (data.audio !== undefined) {
            this._audio = data.audio;
        }
        if (data.background !== undefined) {
            this._background = data.background;
        }
        if (data.sentences) {
            this._sentences = data.sentences;
        }
        if (data.styleClasses) {
            this._styleClasses = data.styleClasses;
        }
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get updateTime(): number {
        return this._updateTime;
    }

    get audio(): NamedAsset | null {
        return this._audio;
    }

    get background(): NamedAsset | null {
        return this._background;
    }

    get sentences(): DraftSentenceInfo[] {
        return this._sentences;
    }

    get styleClasses(): StyleClass[] {
        return this._styleClasses;
    }
}
