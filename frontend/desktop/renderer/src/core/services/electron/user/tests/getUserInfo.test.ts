import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { getUserInfo } from "../getUserInfo";
import { UserDummy } from "@tests/creation/user";

describe("Get user info tests", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.User.getUserInfo.mockResolvedValue(UserDummy.userInfo);
        const result = await getUserInfo();

        expect(ElectronAPIMock.User.getUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.payload).toEqual(UserDummy.userInfo);
        }
    });

    it("negative", async () => {
        ElectronAPIMock.User.getUserInfo.mockRejectedValue({});
        const result = await getUserInfo();

        expect(ElectronAPIMock.User.getUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    it("auth tokens not found", async () => {
        ElectronAPIMock.User.getUserInfo.mockResolvedValue(null);
        const result = await getUserInfo();

        expect(ElectronAPIMock.User.getUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
