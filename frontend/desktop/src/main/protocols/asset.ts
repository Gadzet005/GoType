import { ASSET_PROTOCOL_NAME } from "../consts";
import { app, net, protocol } from "electron";
import path from "path";
import url from "url";

export function initAssetProtocol() {
    protocol.handle(ASSET_PROTOCOL_NAME, (request) => {
        const relPath = path.normalize(
            // remove ASSET_PROTOCOL_NAME://
            request.url.slice(ASSET_PROTOCOL_NAME.length + 3)
        );

        // no escaping from base dir
        if (relPath.startsWith("..")) {
            return new Response("Forbidden", { status: 403 });
        }

        const filePath = path.join(app.getPath("userData"), relPath);
        return net.fetch(url.pathToFileURL(filePath).toString());
    });
}
