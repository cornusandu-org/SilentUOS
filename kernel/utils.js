export const max = (a, b) => a > b ? a : b;
export const min = (a, b) => a < b ? a : b;

/**
 * @param {ArrayBuffer} buff 
 */
export function readStringFromRawBuffer(buff, offset, length) {
    const view = new DataView(buff);

    const textBytes = new Uint8Array(
        view.buffer,
        offset,
        length
    );

    const text = new TextDecoder().decode(textBytes);

    return text;
}

/**
 * @param {string} str 
 * @param {ArrayBuffer} buff 
 * @param {number} offset 
 */
export function writeStringToRawBuffer(str, buff, offset) {
    const bytes = new Uint8Array(buff);

    bytes.set(
        new TextEncoder().encode(str),
        offset
    );
}
