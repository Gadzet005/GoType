import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { removeDraft } from "../removeDraft";

describe("Remove draft test", () => {
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.LevelDraft.removeDraft.mockResolvedValue({});
        const result = await ctx.runService(removeDraft, 1);

        expect(ElectronAPIMock.LevelDraft.removeDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.LevelDraft.removeDraft.mockRejectedValue({});
        const result = await ctx.runService(removeDraft, 1);

        expect(ElectronAPIMock.LevelDraft.removeDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
