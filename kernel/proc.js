import { Sentinel } from './sentinel.js';
import vm from 'vm';

export const ProcessState = Object.freeze({
    Execution: {
        zombie: new Sentinel('EXEC_ZOMBIE', 0x1)
    }
})

export class Process {
    pid;
    context;
    state;
    status;

    /**
     * 
     * @param {string} code 
     */
    constructor(code) {
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
