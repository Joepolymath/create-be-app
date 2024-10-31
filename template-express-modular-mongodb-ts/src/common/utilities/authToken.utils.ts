import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@app/configs';

export const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};
