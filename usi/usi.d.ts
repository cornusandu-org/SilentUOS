declare namespace USI {
    namespace cons {
        function out(str: string): Generator<KernelCall, void, unknown>;
    }
}

interface KernelCall {
    __type: 'kcall';
    kcall: string;
    args: unknown[];
}

declare function main(): Generator<KernelCall, void, unknown>;
