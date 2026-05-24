import { Sentinel } from './sentinel.js';
import * as utils from "./utils.js";
import vm from 'vm';

export const ProcessState = Object.freeze({
    Execution: {
        running: new Sentinel('EXEC_RUN', 0x1),
        zombie: new Sentinel('EXEC_ZOMBIE', 0x2),
    }
});

// class MoreProcData {
//     /**
//      * @param {Uint8Array?} buffer
//      * @param {{pwd: string, parentPID: number}} data
//      */
//     constructor (buffer, data) {
//         if (!buffer)
//             buffer = Buffer.allocUnsafe(136);  /* [pwd - 64 bytes][signal handlers - 64 bytes][parent PID - 8 bytes] */

//         this.mem = buffer.buffer;
//         this.view = new DataView(
//             this.mem,
//             buffer.byteOffset,
//             this.mem.byteLength
//         )
//         this.pwd = data.pwd;
//     }

//     get pwd() {
//         return utils.readStringFromRawBuffer(this.mem, 0, 64).replaceAll("\0", "");
//     }

//     set pwd(v) {
//         const bytes = new TextEncoder().encode(v);
//         if (bytes.length > 64)
//             return;

//         utils.writeStringToRawBuffer(v, this.mem, 0);
//     }
// }

export class Process {
    pid;
    context;
    state;
    status;
    data;
    executionRuntimeData;

    /**
     * @param {string} code 
     * @param {{parent: Process, name: string}} data
     */
    constructor(code, data) {
        const sandbox = {
            USI: {
                cons: {
                    out: function* out(str) {
                        yield Object.freeze({
                            "__type": "kcall",
                            "kcall": "usi-cons-out",
                            "args": [str]
                        });
                    }
                }
            }
        }
        this.context = vm.createContext(sandbox);
        vm.runInContext(code, this.context, {timeout: 10})
        this.state = this.context.main();
        this.status = ProcessState.Execution.running;
        this.data = {
            pwd: "/",
            signalHandlers: {},
            parentPID: data.parent?.pid,
            name: data.name,
            ...data
        }
        this.executionRuntimeData = {};
    }

    execute() {
        if (this.status === ProcessState.Execution.zombie)
            return [true, this.executionRuntimeData.exitCode || -1];
        const v = this.state.next(this.executionRuntimeData.kcallReturn || 0);
        if (v.done) {
            this.kill(v.value || 0);
            return [true, this.executionRuntimeData.exitCode];
        }
        const kcall = v.value;
        if (kcall?.["__type"] === "kcall") {
            switch (kcall["kcall"]) {
                case "usi-cons-out":
                    for (const str of kcall.args)
                        console.log(str);
                    this.executionRuntimeData.kcallReturn = 0;
                    break;
                default:
                    console.error(`${this.data.name}: Unknown kcall: ${kcall.kcall}`);
                    this.kill(-1);
                    return [true, -1];
            }
        } else {
            throw new Error('Invalid state');
        }
        return [false, 0];
    }

    kill(code) {
        this.executionRuntimeData = {exitCode: code};
        this.status = ProcessState.Execution.zombie;
    }
};
