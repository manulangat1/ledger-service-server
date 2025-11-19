import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (data: any, password: string) => {
  return data.password === (await hashPassword(password, data.salt));
};

export const generateRandomText = (value: number) => {
  return randomBytes(value).toString('hex');
};
