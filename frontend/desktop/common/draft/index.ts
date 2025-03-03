import { DraftSentence } from "./sentence";
import { StyleClass } from "./style";
import { NamedAsset } from "../asset";

/**
 * Represents the data structure for a level draft.
 */
export interface DraftData {
    id: number;
    name: string;
    updateTime: number;
    audio: NamedAsset | null;
    background: NamedAsset | null;
    sentences: DraftSentence[];
    styleClasses: StyleClass[];
}

export type DraftAssetType = "audio" | "background";

export namespace DraftUpdate {
    type RequiredArgs = Pick<DraftData, "id">;
    type NoRequiredArgs = Pick<
        DraftData,
        "name" | "sentences" | "styleClasses"
    >;

    /**
     * Handle asset update with special semantics:
     * - undefined: No change to the current file
     * - null: Remove/clear the current file
     * - string: Path to a new file to use
     */
    type AssetUpdateArgs = {
        newAudioFile?: string | null;
        newBackgroundFile?: string | null;
    };

    export type Args = Partial<NoRequiredArgs> & RequiredArgs & AssetUpdateArgs;
}
