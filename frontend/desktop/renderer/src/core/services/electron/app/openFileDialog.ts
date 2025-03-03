import { failure, PromiseResult, success } from "@/core/types/result";
import { FileInfo } from "@desktop-common/file";

export async function openOneFileDialog(
    extensions?: string[]
): PromiseResult<FileInfo | null, string> {
    try {
        const files = await window.appAPI.openFileDialog(extensions);
        if (files.length == 0) {
            return success(null);
        }
        if (files.length == 1) {
            return success(files[0]);
        }
        return failure("too many files");
    } catch {
        return failure("unexpected");
    }
}
