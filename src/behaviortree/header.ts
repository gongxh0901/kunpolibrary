export const enum Status {
    FAILURE,
    SUCCESS,
    RUNNING,
}

export function createUUID(): string {
    let s: string[] = Array(36);
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        let start = Math.floor(Math.random() * 0x10);
        s[i] = hexDigits.substring(start, start + 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = "4";
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    let start = (parseInt(s[19], 16) & 0x3) | 0x8;
    s[19] = hexDigits.substring(start, start + 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    let uuid = s.join("");
    return uuid;
}