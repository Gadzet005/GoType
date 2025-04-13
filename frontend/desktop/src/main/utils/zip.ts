import JSZip from "jszip";
import jetpack from "fs-jetpack";
import path from "path";

export async function extractZipBuffer(zipBuffer: Buffer, extractPath: string) {
    try {
        const zip = await JSZip.loadAsync(zipBuffer);

        await jetpack.dirAsync(extractPath);

        for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            const fullPath = path.join(extractPath, relativePath);

            if (zipEntry.dir) {
                await jetpack.dirAsync(fullPath);
            } else {
                await jetpack.dirAsync(path.dirname(fullPath));
                const content = await zipEntry.async("nodebuffer");
                await jetpack.writeAsync(fullPath, content);
            }
        }
    } catch (error) {
        throw new Error(`Failed to extract zip: ${error}`);
    }
}
