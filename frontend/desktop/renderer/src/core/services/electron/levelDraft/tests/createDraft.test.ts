import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { createDraft } from "../createDraft";
import { LevelDraftInitialInfo } from "@desktop-common/draft";

describe("Create draft test", () => {
    let ctx: AppContext;
    const dummyDraftInitial: LevelDraftInitialInfo = {
        name: "draft",
        audio: {
            type: "mp3",
            url: "audio.mp3",
        },
    };

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.LevelDraft.createDraft.mockResolvedValue({});
        const result = await ctx.runService(createDraft, dummyDraftInitial);

        expect(ElectronAPIMock.LevelDraft.createDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.LevelDraft.createDraft.mockRejectedValue({});
        const result = await ctx.runService(createDraft, dummyDraftInitial);

        expect(ElectronAPIMock.LevelDraft.createDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
