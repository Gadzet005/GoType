import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { removeLevel } from "../removeLevel";

describe("Remove level test", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Level.removeLevel.mockResolvedValue({});
        const result = await removeLevel(1);

        expect(ElectronAPIMock.Level.removeLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Level.removeLevel.mockRejectedValue({});
        const result = await removeLevel(1);

        expect(ElectronAPIMock.Level.removeLevel).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
