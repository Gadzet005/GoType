import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { createDraft } from "../createDraft";

describe("Create draft test", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Draft.createDraft.mockResolvedValue({});
        const result = await createDraft();

        expect(ElectronAPIMock.Draft.createDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
    });

    it("negative", async () => {
        ElectronAPIMock.Draft.createDraft.mockRejectedValue({});
        const result = await createDraft();

        expect(ElectronAPIMock.Draft.createDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
