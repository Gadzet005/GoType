export async function openDraftDir(draftId: number) {
    await window.levelDraftAPI.showDraftDir(draftId);
}
