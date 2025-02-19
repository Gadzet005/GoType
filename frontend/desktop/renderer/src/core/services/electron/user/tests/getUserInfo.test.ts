import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { getUserInfo } from "../getUserInfo";
import { UserDummy } from "@tests/dummy/user";

describe("Get user info tests", () => {
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.User.getUserInfo.mockResolvedValue(UserDummy.userInfo);
        const result = await ctx.runService(getUserInfo);

        expect(ElectronAPIMock.User.getUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        expect(result.payload).toEqual(UserDummy.userInfo);
    });

    it("negative", async () => {
        ElectronAPIMock.User.getUserInfo.mockRejectedValue({});
        const result = await ctx.runService(getUserInfo);

        expect(ElectronAPIMock.User.getUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    it("auth tokens not found", async () => {
        ElectronAPIMock.User.getUserInfo.mockResolvedValue(null);
        const result = await ctx.runService(getUserInfo);

        expect(ElectronAPIMock.User.getUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
