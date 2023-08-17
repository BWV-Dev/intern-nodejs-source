// HashPassword using bcryptjs

import {genSalt, hash} from 'bcryptjs';
import {compare} from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const comparePassword = async (
  providedPass: string,
  storedPass: string,
): Promise<boolean> => {
  const passwordIsMatched = await compare(providedPass, storedPass);
  return passwordIsMatched;
};
