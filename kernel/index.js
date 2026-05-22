import { Process } from "./proc.js";
import fs from "fs";
import path from "path";
import { PanicCodes, StateCheck } from "./panic.js";
import * as klog from "./log.js";

klog.out(klog.INFO, "Booting");
klog.out(klog.INFO, "Obtaining host rootfs");
const rootfs = path.join(import.meta.dirname, "..", "rootfs");

klog.out(klog.INFO, "Reading init");
const initCode = fs.readFileSync(path.join(rootfs, "init.js"), 'utf8');

klog.out(klog.INFO, "Starting init");
let process;
try {
    process = new Process(initCode);
} catch (e) {
    klog.out(klog.CRITICAL, `Failed to start init: ${e.message}`);
    StateCheck(PanicCodes.CriticalProcessDied);
}
let x = [false, 0];
while (x[0] === false)
    x = process.execute();

klog.out(klog.CRITICAL, `Init exited with status code ${x[1]}.`);
StateCheck(PanicCodes.CriticalProcessDied);
