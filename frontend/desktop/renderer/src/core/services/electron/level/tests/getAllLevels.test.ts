import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { createDummyLevel } from "@tests/dummy/level";
import { getAllLevels } from "../getAllLevels";

describe("Get all levels test", () => {
    const dummyLevel = createDummyLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.getAllLevels.mockResolvedValue([
            dummyLevel,
            dummyLevel,
        ]);
        const result = await getAllLevels();

        expect(ElectronAPIMock.Level.getAllLevels).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.payload).toEqual([dummyLevel, dummyLevel]);
        }
    });

    it("negative", async () => {
        ElectronAPIMock.Level.getAllLevels.mockRejectedValue({});
        const result = await getAllLevels();

        expect(ElectronAPIMock.Level.getAllLevels).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
