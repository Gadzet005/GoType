import { Draft } from "@/components/pages/LevelEditorPage/store/draft";
import { LevelAPI } from "@/core/types/api/level";
import { LevelCreationData } from "@common/draft";
import { SentenceData } from "@common/level/sentence";
import JSZip from "jszip";

function getServerStoredData(draft: Draft): LevelAPI.ServerStoredLevelData {
    const sentences: SentenceData[] = [];

    draft.sentences.forEach((sentence) => {
        const data = sentence.toSentenceData();
        if (data) {
            sentences.push(data);
        }
    });

    return {
        sentences: sentences,
        background: {
            ext: draft.background.asset?.ext!,
            brightness: draft.background.brightness,
        },
        audioExt: draft.audio?.ext!,
    };
}

export async function createLevelArchive(
    data: LevelCreationData
): Promise<Blob> {
    const zip = new JSZip();

    const draft = new Draft(data.draft);
    const serverData = getServerStoredData(draft);

    zip.file("level.json", JSON.stringify(serverData));

    if (draft.publication.preview) {
        zip.file("preview." + draft.publication.preview.ext, data.preview, {
            base64: true,
        });
    }

    if (draft.audio) {
        zip.file("audio." + draft.audio.ext, data.audio, {
            base64: true,
        });
    }

    if (draft.background.asset) {
        zip.file("background." + draft.background.asset.ext, data.background);
    }

    return await zip.generateAsync({ type: "blob" });
}
