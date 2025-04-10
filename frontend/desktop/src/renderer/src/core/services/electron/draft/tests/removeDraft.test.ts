import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { removeDraft } from "../removeDraft";

describe("Remove draft test", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Draft.removeDraft.mockResolvedValue({});
        const result = await removeDraft(1);

        expect(ElectronAPIMock.Draft.removeDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Draft.removeDraft.mockRejectedValue({});
        const result = await removeDraft(1);

        expect(ElectronAPIMock.Draft.removeDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
