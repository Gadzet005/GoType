import { ASSET_PROTOCOL_NAME } from "../consts";
import { app, net, protocol } from "electron";
import { URL, pathToFileURL } from "url";
import path from "path";

export function initAssetProtocol() {
    protocol.handle(ASSET_PROTOCOL_NAME, (request) => {
        const requestURL = new URL(request.url);
        const relPath = path.normalize(requestURL.pathname);

        // no escaping from base dir
        if (relPath.startsWith("..")) {
            return new Response("Forbidden", { status: 403 });
        }

        const filePath = path.join(app.getPath("userData"), relPath);
        return net.fetch(pathToFileURL(filePath).toString());
    });
}
