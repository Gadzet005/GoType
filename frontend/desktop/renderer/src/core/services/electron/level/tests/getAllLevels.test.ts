import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { createDummyLevel } from "@tests/dummy/level";
import { getAllLevels } from "../getAllLevels";

describe("Get all levels test", () => {
    let ctx: AppContext;
    const dummyLevel = createDummyLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.getAllLevels.mockResolvedValue([
            dummyLevel,
            dummyLevel,
        ]);
        const result = await ctx.runService(getAllLevels);

        expect(ElectronAPIMock.Level.getAllLevels).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        expect(result.payload).toEqual([dummyLevel, dummyLevel]);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.getAllLevels.mockRejectedValue({});
        const result = await ctx.runService(getAllLevels);

        expect(ElectronAPIMock.Level.getAllLevels).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
