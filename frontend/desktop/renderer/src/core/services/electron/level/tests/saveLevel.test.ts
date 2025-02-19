import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { saveLevel } from "../saveLevel";
import { createDummyLevel } from "@tests/dummy/level";

describe("Save level test", () => {
    let ctx: AppContext;
    const dummyLevel = createDummyLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.saveLevel.mockResolvedValue({});
        const result = await ctx.runService(saveLevel, dummyLevel);

        expect(ElectronAPIMock.Level.saveLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.saveLevel.mockRejectedValue({});
        const result = await ctx.runService(saveLevel, dummyLevel);

        expect(ElectronAPIMock.Level.saveLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
