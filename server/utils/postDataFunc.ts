import { Buffer } from 'buffer';
import * as gpsFetchTo from 'node-fetch';

export function base64ToHex(base64Str: string) {
  const base64 = Buffer.from(base64Str, 'base64').toString('hex').toUpperCase();
  return base64.substring(0, 8) + '-' + base64.substring(8);
}

export async function gpsFetch(latitude: number, longitude: number) {
  try {
    const res = await gpsFetchTo.default(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=16`
    );
    const data = await res.json();
    const location = !data.address.county
      ? JSON.stringify(data.address.city_district)
          .replace(/\ /, `++`)
          .split('++')[1]
          .replace(/\"/, ``)
      : JSON.stringify(data.address.county).replace(/\ /, `++`).split('++')[1].replace(/\"/, ``);
    return location;
  } catch (err) {
    return;
  }
}
