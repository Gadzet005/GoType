import { ASSET_PROTOCOL_NAME } from "../consts";
import { app, net, protocol } from "electron";
import { URL, pathToFileURL } from "url";
import path from "path";
import fs from "fs";

export function initAssetProtocol() {
    protocol.handle(ASSET_PROTOCOL_NAME, async (request) => {
        try {
            const requestURL = new URL(request.url);
            const decodedPath = decodeURIComponent(requestURL.pathname);
            const relPath = path.normalize(decodedPath);

            if (relPath.startsWith("..") || relPath.includes("../")) {
                console.error(
                    `Security issue: Path traversal attempt: ${relPath}`
                );
                return new Response("Forbidden", { status: 403 });
            }

            const filePath = path.join(app.getPath("userData"), relPath);

            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                return new Response("Not Found", { status: 404 });
            }

            const fileUrl = pathToFileURL(filePath).toString();

            return net.fetch(fileUrl);
        } catch (error) {
            console.error(`Error handling asset: ${error}`);
            return new Response(`Error: ${error}`, { status: 500 });
        }
    });
}
