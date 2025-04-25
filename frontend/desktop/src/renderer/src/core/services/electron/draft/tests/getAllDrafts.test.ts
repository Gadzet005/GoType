import { ElectronAPIMock } from "@tests/base/electronApiMock";
import { getAllDrafts } from "../getAllDrafts";
import { createLevelDraft } from "@tests/creation/levelDraft";

describe("Get all drafts test", () => {
    const dummyDraft = createLevelDraft();

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
