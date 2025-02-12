import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { createDummyLevel } from "@tests/dummy/level";
import { getLevel } from "../getLevel";

describe("Get level test", () => {
    let ctx: AppContext;
    const dummyLevel = createDummyLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.getLevel.mockResolvedValue(dummyLevel);
        const result = await ctx.runService(getLevel, 0);

        expect(ElectronAPIMock.Level.getLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        expect(result.payload).toBe(dummyLevel);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.getLevel.mockRejectedValue({});
        const result = await ctx.runService(getLevel, 0);

        expect(ElectronAPIMock.Level.getLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    it("level not found", async () => {
        ElectronAPIMock.Level.getLevel.mockResolvedValue(null);
        const result = await ctx.runService(getLevel, 0);

        expect(ElectronAPIMock.Level.getLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
