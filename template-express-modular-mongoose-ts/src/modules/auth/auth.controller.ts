import HttpException from '../../common/utilities/exceptions/http.exceptions';
import Controller from '../../common/utilities/exceptions/http.exceptions';
import { NextFunction, Router, Request, Response } from 'express';
import AuthServices from './auth.service';

const authServices = new AuthServices();
export default class AuthController implements Controller {
  public path: string = '/auth';
  public router: Router = Router();

  constructor() {
    this.loadRoutes();
  }
  public status: string;
  public statusCode: number;
  public message: string;
  name: string;
  stack?: string;

  private loadRoutes() {
    this.router.post(`${this.path}/signup/admins`, this.signUpAdmin);
    this.router.post(`${this.path}/signup/users`, this.signUpUser);
    this.router.post(`${this.path}/login/admins`, this.loginAdmin);
    this.router.post(`${this.path}/login/users`, this.loginUser);
  }

  private async signUpAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await authServices.signupAdmin(req.body);
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }

  private async signUpUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await authServices.signupUser(req.body);
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }

  private async loginAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await authServices.loginAdmin(req.body);
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }

  private async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await authServices.loginUser(req.body);
      return res
        .status(data.statusCode)
        .json({ ...data, message: data.message });
    } catch (error: any) {
      next(new HttpException(500, error.message));
    }
  }
}
