import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { clearUserInfo } from "../clearUserInfo";

describe("Clear user info tests", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.User.clearUserInfo.mockResolvedValue({});
        const result = await clearUserInfo();

        expect(ElectronAPIMock.User.clearUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.User.clearUserInfo.mockRejectedValue({});
        const result = await clearUserInfo();

        expect(ElectronAPIMock.User.clearUserInfo).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
