import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { saveUserInfo } from "../saveUserInfo";
import { UserDummy } from "@tests/dummy/user";

describe("Save user info tests", () => {
    let ctx: AppContext;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.User.saveUserInfo.mockResolvedValue({});
        const result = await ctx.runService(saveUserInfo, UserDummy.userInfo);

        expect(ElectronAPIMock.User.saveUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.User.saveUserInfo.mockRejectedValue({});
        const result = await ctx.runService(saveUserInfo, UserDummy.userInfo);

        expect(ElectronAPIMock.User.saveUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
