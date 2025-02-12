import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { addLevel } from "../addLevel";
import { createDummyLevel } from "@tests/dummy/level";

describe("Add level test", () => {
    let ctx: AppContext;
    const dummyLevel = createDummyLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.addLevel.mockResolvedValue({});
        const result = await ctx.runService(addLevel, dummyLevel);

        expect(ElectronAPIMock.Level.addLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.addLevel.mockRejectedValue({});
        const result = await ctx.runService(addLevel, dummyLevel);

        expect(ElectronAPIMock.Level.addLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
