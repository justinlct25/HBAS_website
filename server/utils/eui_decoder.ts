import { Buffer } from 'buffer';

export function base64ToHex(base64Str:string) {
    const base64:string = Buffer.from(base64Str, 'base64').toString('hex');
    return base64;
}