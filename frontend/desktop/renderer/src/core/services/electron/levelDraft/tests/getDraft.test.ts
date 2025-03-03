import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { createDummyLevelDraft } from "@tests/dummy/levelDraft";
import { getDraft } from "../getDraft";

describe("Get draft test", () => {
    const dummyDraft = createDummyLevelDraft();

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Draft.getDraft.mockResolvedValue(dummyDraft);
        const result = await getDraft(0);

        expect(ElectronAPIMock.Draft.getDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.payload).toEqual(dummyDraft);
        }
    });

    it("negative", async () => {
        ElectronAPIMock.Draft.getDraft.mockRejectedValue({});
        const result = await getDraft(0);

        expect(ElectronAPIMock.Draft.getDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    it("draft not found", async () => {
        ElectronAPIMock.Draft.getDraft.mockResolvedValue(null);
        const result = await getDraft(0);

        expect(ElectronAPIMock.Draft.getDraft).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
