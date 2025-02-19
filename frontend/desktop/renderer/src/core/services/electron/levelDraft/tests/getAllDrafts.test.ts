import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { getAllDrafts } from "../getAllDrafts";
import { createDummyLevelDraft } from "@tests/dummy/levelDraft";

describe("Get all drafts test", () => {
    let ctx: AppContext;
    const dummyDraft = createDummyLevelDraft();

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.LevelDraft.getAllDrafts.mockResolvedValue([
            dummyDraft,
            dummyDraft,
        ]);
        const result = await ctx.runService(getAllDrafts);

        expect(ElectronAPIMock.LevelDraft.getAllDrafts).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        expect(result.payload).toEqual([dummyDraft, dummyDraft]);
    });

    it("negative", async () => {
        ElectronAPIMock.LevelDraft.getAllDrafts.mockRejectedValue({});
        const result = await ctx.runService(getAllDrafts);

        expect(ElectronAPIMock.LevelDraft.getAllDrafts).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
