import { Sentinel } from './sentinel.js';

export const PanicCodes = Object.freeze({
    CriticalProcessDied: new Sentinel('CRITICAL_PROCESS_DIED', 0x1)
});

function center(str, width = process.stdout.columns || 80) {
    const clean = str.replace(/\n$/, '');
    const padding = Math.max(0, Math.floor((width - clean.length) / 2));
    return ' '.repeat(padding) + clean;
}

function title(str, width = process.stdout.columns || 80) {
    const clean = str.replace(/\n$/, '-');
    const padding = Math.max(0, Math.floor((width - clean.length) / 2));
    return '-'.repeat(padding) + clean + '-'.repeat(padding);
}


export function StateCheck(code, fmt, ...args) {
    console.error(`${title("State Check")}\n\n\n\n${center(String(code))}\n\n\n\n\n\n`);
    console.error(fmt || "", ...args);
    process.exit(1);
}
