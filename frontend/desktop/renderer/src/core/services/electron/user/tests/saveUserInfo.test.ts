import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { saveUserInfo } from "../saveUserInfo";
import { UserDummy } from "@tests/creation/user";

describe("Save user info tests", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.User.saveUserInfo.mockResolvedValue({});
        const result = await saveUserInfo(UserDummy.userInfo);

        expect(ElectronAPIMock.User.saveUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.User.saveUserInfo.mockRejectedValue({});
        const result = await saveUserInfo(UserDummy.userInfo);

        expect(ElectronAPIMock.User.saveUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
