import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { clearUserInfo } from "../clearUserInfo";

describe("Clear user info tests", () => {
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.User.clearUserInfo.mockResolvedValue({});
        const result = await ctx.runService(clearUserInfo);

        expect(ElectronAPIMock.User.clearUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.User.clearUserInfo.mockRejectedValue({});
        const result = await ctx.runService(clearUserInfo);

        expect(ElectronAPIMock.User.clearUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
