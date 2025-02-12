import { GlobalAppContext } from "@/core/store/appContext";
import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { AppContext } from "@/core/types/base/app";
import { getAuthTokens } from "../getAuthTokens";
import { UserDummy } from "@tests/dummy/user";

describe("Get auth tokens tests", () => {
    let ctx: AppContext;
    const dummyAuthTokens = UserDummy.authTokens;

    beforeEach(() => {
        vi.restoreAllMocks();
        ctx = new GlobalAppContext();
    });

    it("positive", async () => {
        ElectronAPIMock.User.getTokens.mockResolvedValue(dummyAuthTokens);
        const result = await ctx.runService(getAuthTokens);

        expect(ElectronAPIMock.User.getTokens).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        expect(result.payload).toEqual(dummyAuthTokens);
    });

    it("negative", async () => {
        ElectronAPIMock.User.getTokens.mockRejectedValue({});
        const result = await ctx.runService(getAuthTokens);

        expect(ElectronAPIMock.User.getTokens).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    it("auth tokens not found", async () => {
        ElectronAPIMock.User.getTokens.mockResolvedValue(null);
        const result = await ctx.runService(getAuthTokens);

        expect(ElectronAPIMock.User.getTokens).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
