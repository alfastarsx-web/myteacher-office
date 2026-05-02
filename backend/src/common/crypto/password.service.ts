import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

@Injectable()
export class PasswordService {
  hash(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(String(password), salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  verify(password: string, stored: string): boolean {
    if (!stored || !stored.includes(':')) return false;
    const [salt, hash] = stored.split(':');
    const expected = Buffer.from(hash, 'hex');
    const actual = scryptSync(String(password), salt, 64);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}
