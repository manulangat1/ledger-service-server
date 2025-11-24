import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../../db/entities/user.entity';
import { Admin } from '../../db/entities/admin.entity';
export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (data: User | Admin, password: string) => {
  return data.password === (await hashPassword(password, data.salt));
};

export const generateRandomText = (value: number) => {
  return randomBytes(value).toString('hex');
};
