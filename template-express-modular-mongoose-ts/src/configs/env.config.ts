import dotenv from 'dotenv';
import { IEnv } from '../common/@types/env.types';
dotenv.config();

declare var process: {
  env: any;
};

export const {
  PORT,
  DB_URI,
  NODE_ENV,
  API_KEY,
  BCRYPT_SALT,
  JWT_SECRET,
}: IEnv = process.env;
