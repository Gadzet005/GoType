import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { getAllDrafts } from "../getAllDrafts";
import { createDummyLevelDraft } from "@tests/dummy/levelDraft";

describe("Get all drafts test", () => {
    const dummyDraft = createDummyLevelDraft();

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("positive", async () => {
        ElectronAPIMock.Draft.getAllDrafts.mockResolvedValue([
            dummyDraft,
            dummyDraft,
        ]);
        const result = await getAllDrafts();

        expect(ElectronAPIMock.Draft.getAllDrafts).toBeCalledTimes(1);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.payload).toEqual([dummyDraft, dummyDraft]);
        }
    });

    it("negative", async () => {
        ElectronAPIMock.Draft.getAllDrafts.mockRejectedValue({});
        const result = await getAllDrafts();

        expect(ElectronAPIMock.Draft.getAllDrafts).toBeCalledTimes(1);
        expect(result.ok).toBe(false);
    });
});
