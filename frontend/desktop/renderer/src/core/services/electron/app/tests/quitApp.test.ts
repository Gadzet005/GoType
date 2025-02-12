import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { quitApp } from "../quitApp";
import { AppContext } from "@/core/types/base/app";

describe("Quit app test", () => {
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.App.quitApp.mockResolvedValue({});
        const result = await ctx.runService(quitApp);

        expect(ElectronAPIMock.App.quitApp).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.App.quitApp.mockRejectedValue({});
        const result = await ctx.runService(quitApp);

        expect(ElectronAPIMock.App.quitApp).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
