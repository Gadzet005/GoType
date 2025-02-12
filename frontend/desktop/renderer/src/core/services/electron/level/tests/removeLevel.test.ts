import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { removeLevel } from "../removeLevel";

describe("Remove level test", () => {
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.removeLevel.mockResolvedValue({});
        const result = await ctx.runService(removeLevel, 1);

        expect(ElectronAPIMock.Level.removeLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.removeLevel.mockRejectedValue({});
        const result = await ctx.runService(removeLevel, 1);

        expect(ElectronAPIMock.Level.removeLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
