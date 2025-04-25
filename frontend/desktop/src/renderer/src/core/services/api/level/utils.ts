import { Draft } from "@/components/pages/LevelEditorPage/store/draft";
import { IUser } from "@/core/types/base/user";
import { LevelCreationData } from "@common/draft";
import { ExternalLevelData } from "@common/level";
import { SentenceData } from "@common/level/sentence";
import JSZip from "jszip";

function getServerStoredData(
    draft: Draft,
    user: IUser,
    duration: number
): ExternalLevelData {
    const sentences: SentenceData[] = [];

    draft.sentences.forEach((sentence) => {
        const data = sentence.toSentenceData();
        if (data) {
            sentences.push(data);
        }
    });

    return {
        name: draft.publication.levelName,
        description: draft.publication.description,
        duration: duration,
        author: {
            id: user.profile!.id,
            name: user.profile!.name,
        },
        languageCode: draft.language.code,
        tags: [],
        difficulty: draft.publication.difficulty,
        sentences: sentences,
        previewExt: draft.publication.preview!.ext,
        background: {
            ext: draft.background.asset?.ext!,
            brightness: draft.background.brightness,
        },
        audioExt: draft.audio?.ext!,
    };
}

export async function createLevelArchive(
    data: LevelCreationData,
    user: IUser,
    duration: number
): Promise<Blob> {
    const zip = new JSZip();

    const draft = new Draft(data.draft);
    const serverData = getServerStoredData(draft, user, duration);

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
        zip.file("background." + draft.background.asset.ext, data.background, {
            base64: true,
        });
    }

    return await zip.generateAsync({ type: "blob" });
}

export function base64ToBlob(base64: string, contentType: string): Blob {
    const base64Data = base64.includes("base64,")
        ? base64.split("base64,")[1]
        : base64;

    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: contentType });
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const pureBase64 = base64String.split(",")[1];
            resolve(pureBase64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
