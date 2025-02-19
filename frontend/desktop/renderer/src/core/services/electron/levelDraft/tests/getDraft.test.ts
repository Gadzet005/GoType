import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { createDummyLevelDraft } from "@tests/dummy/levelDraft";
import { getDraft } from "../getDraft";

describe("Get draft test", () => {
    let ctx: AppContext;
    const dummyDraft = createDummyLevelDraft();

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.LevelDraft.getDraft.mockResolvedValue(dummyDraft);
        const result = await ctx.runService(getDraft, 0);

        expect(ElectronAPIMock.LevelDraft.getDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        expect(result.payload).toBe(dummyDraft);
    });

    it("negative", async () => {
        ElectronAPIMock.LevelDraft.getDraft.mockRejectedValue({});
        const result = await ctx.runService(getDraft, 0);

        expect(ElectronAPIMock.LevelDraft.getDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    it("draft not found", async () => {
        ElectronAPIMock.LevelDraft.getDraft.mockResolvedValue(null);
        const result = await ctx.runService(getDraft, 0);

        expect(ElectronAPIMock.LevelDraft.getDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
