import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../configs/env.config';
import { userModel } from '@app/modules/users/models';
import { HttpException } from '../utilities';

class AuthMiddleware {
  public async authenticateDoctor(req: any, res: Response, next: NextFunction) {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // get token from header
        token = req.headers.authorization.split(' ')[1];

        // verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from the token
        req.user = await userModel.findById(decoded.id).select('-password');
        if (req.user.role !== 'doctor') {
          return new HttpException(403, 'User not Authorized');
        }
        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, No token not found');
    }
  }

  public async authenticatePatient(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // get token from header
        token = req.headers.authorization.split(' ')[1];

        // verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from the token
        req.user = await userModel.findById(decoded.id).select('-password');
        if (req.user.role !== 'patient') {
          return new HttpException(403, 'User not Authorized');
        }
        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, No token not found');
    }
  }
}

export const authMiddleware = new AuthMiddleware();
