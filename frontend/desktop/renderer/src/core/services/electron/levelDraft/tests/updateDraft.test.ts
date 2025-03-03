import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { updateDraft } from "../updateDraft";

describe("Update draft test", () => {
    const dummyUpdateInfo = {
        id: 1,
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Draft.updateDraft.mockResolvedValue({});
        const result = await updateDraft(dummyUpdateInfo);

        expect(ElectronAPIMock.Draft.updateDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Draft.updateDraft.mockRejectedValue({});
        const result = await updateDraft(dummyUpdateInfo);

        expect(ElectronAPIMock.Draft.updateDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
