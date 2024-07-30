
export type HexString = `0x${string}`;

//TODO: this should actually be a global util
export function stringToHex(input: string): HexString {
    const hexString = input.startsWith('0x') ? input.substring(2) : input;
    return `0x${hexString}`;
}