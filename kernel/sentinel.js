class _Sentinel {
    value;
    name;
    /**
     * @param {number} value 
     * @param {*} name 
     */
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    toString() {
        return `${String(this.name)} (0x${this.value.toString(16).toLowerCase()})`;
    }
}

/**
 * @param {*} name 
 * @param {number} value 
 * @returns 
 */
export function Sentinel(name, value) {
    if (!this)
        throw new Error('Missing API \'Sentinel()\'. Did you mean: \'new Sentinel()\'?');

    return new _Sentinel(value, name);
}
