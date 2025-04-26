import { ApiRoutes } from "@/core/config/api.config";
import { AppContext } from "@/core/types/base/app";
import {
    commonApiErrorResult,
    failure,
    PromiseResult,
    success,
} from "@/core/types/result";
import { getLevelCreationData } from "../../electron/draft/getLevelCreationData";
import { Draft } from "@/components/pages/LevelEditorPage/store/draft";
import { LevelAPI } from "@/core/types/api/level";
import { base64ToBlob, createLevelArchive } from "./utils";

export async function publishLevel(
    ctx: AppContext,
    draft: Draft,
    audioDuration: number
): PromiseResult<number, string> {
    try {
        const result = await getLevelCreationData(draft.id);
        if (!result.ok) {
            return failure("invalid");
        }

        const data = result.payload;
        const duration = Math.ceil(audioDuration);

        const creationData: LevelAPI.CreationData = {
            id: data.draft.publication.levelId ?? undefined,
            name: data.draft.publication.levelName,
            description: data.draft.publication.description,
            tags: [],
            author: ctx.user.profile?.id!,
            author_name: ctx.user.profile?.name!,
            image_type: data.draft.publication.preview?.ext!,
            difficulty: data.draft.publication.difficulty,
            type: "classic",
            language: data.draft.languageCode,
            duration: duration,
        };

        const levelArchive = await createLevelArchive(data, ctx.user, duration);

        const formData = new FormData();
        formData.append(
            "info",
            new Blob([JSON.stringify(creationData)], {
                type: "application/json",
            }),
            "info.json"
        );
        formData.append("level", levelArchive, "level.zip");
        formData.append(
            "preview",
            base64ToBlob(
                data.preview,
                "image/" + data.draft.publication.preview?.ext
            ),
            "preview." + data.draft.publication.preview?.ext
        );

        const creating = data.draft.publication.levelId === null;

        let levelId: number;
        if (creating) {
            const response = await ctx.authApi.post(
                ApiRoutes.Level.CREATE_LEVEL,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            levelId = response.data.id;
        } else {
            await ctx.authApi.put(ApiRoutes.Level.UPDATE_LEVEL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            levelId = data.draft.publication.levelId!;
        }

        return success(levelId);
    } catch (err) {
        return commonApiErrorResult(err);
    }
}
