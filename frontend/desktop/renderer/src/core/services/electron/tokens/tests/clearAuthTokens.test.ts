import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { clearAuthTokens } from "../clearAuthTokens";

describe("Clear auth tokens tests", () => {
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.User.clearTokens.mockResolvedValue({});
        const result = await ctx.runService(clearAuthTokens);

        expect(ElectronAPIMock.User.clearTokens).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.User.clearTokens.mockRejectedValue({});
        const result = await ctx.runService(clearAuthTokens);

        expect(ElectronAPIMock.User.clearTokens).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
