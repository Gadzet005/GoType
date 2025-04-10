import path from "path";

export function getExt(p: string) {
    const ext = path.extname(p);
    if (ext.length === 0) {
        return "";
    }
    return ext.slice(1, ext.length); // remove dot
}
