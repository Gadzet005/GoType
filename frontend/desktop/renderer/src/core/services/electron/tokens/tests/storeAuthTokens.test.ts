import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { storeAuthTokens } from "../storeAuthTokens";
import { UserDummy } from "@tests/dummy/user";

describe("Store auth tokens tests", () => {
    let ctx: AppContext;
    const dummyAuthTokens = UserDummy.authTokens;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.User.storeTokens.mockResolvedValue({});
        const result = await ctx.runService(storeAuthTokens, dummyAuthTokens);

        expect(ElectronAPIMock.User.storeTokens).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.User.storeTokens.mockRejectedValue({});
        const result = await ctx.runService(storeAuthTokens, dummyAuthTokens);

        expect(ElectronAPIMock.User.storeTokens).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
