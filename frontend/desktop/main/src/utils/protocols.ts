import { net } from "electron";
import path from "path";
import url from "url";

type ProtocolHandler = (
    request: GlobalRequest
) => GlobalResponse | Promise<GlobalResponse>;

export function getDirProtocolHandler(
    name: string,
    dir: string
): ProtocolHandler {
    return (request) => {
        const relPath = path.normalize(
            // remove PROTOCOL_NAME://
            request.url.slice(name.length + 3)
        );

        // no escaping from base dir
        if (relPath.startsWith("..")) {
            return new Response("Forbidden", { status: 403 });
        }

        const filePath = path.join(dir, relPath);
        return net.fetch(url.pathToFileURL(filePath).toString());
    };
}
