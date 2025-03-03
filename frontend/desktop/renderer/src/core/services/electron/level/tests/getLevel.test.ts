import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { createDummyLevel } from "@tests/dummy/level";
import { getLevel } from "../getLevel";

describe("Get level test", () => {
    const dummyLevel = createDummyLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.getLevel.mockResolvedValue(dummyLevel);
        const result = await getLevel(0);

        expect(ElectronAPIMock.Level.getLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.payload).toBe(dummyLevel);
        }
    });

    it("negative", async () => {
        ElectronAPIMock.Level.getLevel.mockRejectedValue({});
        const result = await getLevel(0);

        expect(ElectronAPIMock.Level.getLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    it("level not found", async () => {
        ElectronAPIMock.Level.getLevel.mockResolvedValue(null);
        const result = await getLevel(0);

        expect(ElectronAPIMock.Level.getLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
