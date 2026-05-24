import * as klog from "./log.js";
import path from "path";
import fs from "fs";

klog.out(klog.INFO, "Obtaining host rootfs");
const rootfs = path.join(import.meta.dirname, "..", "rootfs");

export function resolve(p) {
    const resolved = path.join(rootfs, p);
    return resolved;
}

export function read(path, encoding = 'utf8') {
    const resolved = resolve(path);
    return fs.readFileSync(resolved, {encoding: encoding});
}
