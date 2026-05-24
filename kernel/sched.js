import { Process } from "./proc.js";
import { read } from "./fs.js";
import * as klog from "./log.js";
import { PanicCodes, StateCheck } from "./panic.js";

const MAX_PROCESSES = 2048n;
let ProcessNumber = 0n;

/**
 * @type {Array<Process>}
 */
const processes = new Array(MAX_PROCESSES);
let procIndex = 0n;

const initProcesses = {
    init: "/init.js"
};

export function schedInit() {
    let i = 0;
    for (const [name, initProcess] of Object.entries(initProcesses)) {
        klog.out(klog.INFO, `Starting ${name}.`);
        processes[i] = new Process(read(initProcess), {parent: undefined, name: name, critical: true});
        i++;
        ProcessNumber += 1n;
    }
}

export function schedLoop() {
    const process = processes[procIndex];
    let [exited, code] = process.execute();
    if (exited && process.data.critical === true) {
        klog.out(klog.CRITICAL, `${process.data.name} exited with status code ${code}.`);
        StateCheck(PanicCodes.CriticalProcessDied);
    }
    procIndex++;
    if (procIndex >= ProcessNumber)
        procIndex = 0n;
}
