import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { updateDraft } from "../updateDraft";
import { createDummyLevelDraft } from "@tests/dummy/levelDraft";

describe("Update draft test", () => {
    let ctx: AppContext;
    const dummyDraft = createDummyLevelDraft();

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.LevelDraft.updateDraft.mockResolvedValue({});
        const result = await ctx.runService(updateDraft, dummyDraft);

        expect(ElectronAPIMock.LevelDraft.updateDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.LevelDraft.updateDraft.mockRejectedValue({});
        const result = await ctx.runService(updateDraft, dummyDraft);

        expect(ElectronAPIMock.LevelDraft.updateDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
