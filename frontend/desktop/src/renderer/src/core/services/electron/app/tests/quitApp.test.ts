import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { quitApp } from "../quitApp";

describe("Quit app test", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.App.quitApp.mockResolvedValue({});
        const result = await quitApp();

        expect(ElectronAPIMock.App.quitApp).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.App.quitApp.mockRejectedValue({});
        const result = await quitApp();

        expect(ElectronAPIMock.App.quitApp).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
