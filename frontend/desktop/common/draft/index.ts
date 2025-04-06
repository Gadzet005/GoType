import { DraftSentenceInfo } from "./sentence";
import { NamedSentenceStyleClass } from "./style";
import { NamedAsset } from "../asset";

/**
 * Represents the data structure for a level draft.
 */
export interface DraftInfo {
    id: number;
    name: string;
    updateTime: number;
    audio: NamedAsset | null;
    background: NamedAsset | null;
    languageCode: string;
    sentences: DraftSentenceInfo[];
    styleClasses: NamedSentenceStyleClass[];
}

export type DraftAssetType = "audio" | "background";

export namespace DraftUpdate {
    type RequiredArgs = Pick<DraftInfo, "id">;
    type NoRequiredArgs = Pick<
        DraftInfo,
        "name" | "sentences" | "styleClasses" | "languageCode"
    >;

    /**
     * - null: remove the current file
     * - string: path to a new file to use
     */
    type AssetUpdateArgs = {
        newAudioFile?: string | null;
        newBackgroundFile?: string | null;
    };

    export type Args = Partial<NoRequiredArgs> & RequiredArgs & AssetUpdateArgs;
}
