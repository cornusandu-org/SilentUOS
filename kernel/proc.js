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

    /**
     * @param {string} code 
     * @param {{parent: Process, name: string}} data
     */
    constructor(code, data) {
        const sandbox = {
            USI: {
                cons: {
                    out: function* out(str) {
                        yield {
                            "__type": "kcall",
                            "kcall": "usi-cons-out",
                            "args": [str]
                        };
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
    }

    execute() {
        const v = this.state.next();
        if (v.done)
            return [true, v.value || 0];
        const kcall = v.value;
        if (kcall?.["__type"] === "kcall") {
            switch (kcall["kcall"]) {
                case "usi-cons-out":
                    for (const str of kcall.args)
                        console.log(str);
                    break;
                default:
                    throw new Error(`Unknown kcall: ${kcall.kcall}`);
            }
        } else {
            throw new Error('Invalid state');
        }
        return [false, 0];
    }
};
