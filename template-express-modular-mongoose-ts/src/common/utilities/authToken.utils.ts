import { JWT_SECRET } from '../../configs/env.config';
import jwt from 'jsonwebtoken';

export const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};
