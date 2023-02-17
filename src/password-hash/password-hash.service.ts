import { Injectable } from '@nestjs/common';
import bcrypt = require('bcrypt');

@Injectable()
export class PasswordHashService {
  async hashPassword(plaintextPassword: string): Promise<any> {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
  }

  async comparePassword(plaintextPassword: string, hash: any): Promise<any> {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }
}
