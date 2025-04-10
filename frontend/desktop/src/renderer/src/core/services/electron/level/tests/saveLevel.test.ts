import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { saveLevel } from "../saveLevel";
import { createLevel } from "@tests/creation/level";

describe("Save level test", () => {
    const dummyLevel = createLevel([]);

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.saveLevel.mockResolvedValue({});
        const result = await saveLevel(dummyLevel);

        expect(ElectronAPIMock.Level.saveLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.saveLevel.mockRejectedValue({});
        const result = await saveLevel(dummyLevel);

        expect(ElectronAPIMock.Level.saveLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
