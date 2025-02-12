import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { createDummyLevel } from "@tests/dummy/level";
import { getLevels } from "../getLevels";

describe("Get levels test", () => {
    let ctx: AppContext;
    const dummyLevel = createDummyLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.getLevels.mockResolvedValue([
            dummyLevel,
            dummyLevel,
        ]);
        const result = await ctx.runService(getLevels);

        expect(ElectronAPIMock.Level.getLevels).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        expect(result.payload).toEqual([dummyLevel, dummyLevel]);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.getLevels.mockRejectedValue({});
        const result = await ctx.runService(getLevels);

        expect(ElectronAPIMock.Level.getLevels).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
