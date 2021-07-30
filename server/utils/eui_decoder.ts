import { Buffer } from 'buffer';

export function base64ToHex(base64Str: string) {
  const base64 = Buffer.from(base64Str, 'base64').toString('hex').toUpperCase();
  return base64.substring(0, 8) + '-' + base64.substring(8);
}
