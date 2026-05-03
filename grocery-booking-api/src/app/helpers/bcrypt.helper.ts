import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptHelper {
  public hash(plainText: string, saltRounds: number = 10) {
    return hash(plainText, saltRounds);
  }

  public compareHash(plainText: string, hashString: string) {
    return compare(plainText, hashString);
  }
}
