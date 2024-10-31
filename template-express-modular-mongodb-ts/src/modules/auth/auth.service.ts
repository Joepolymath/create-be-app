import {
  bcryptService,
  DAL,
  generateToken,
  HttpException,
  responseUtils,
} from '@app/common';
import { BCRYPT_SALT } from '@app/configs';
import { IUser, Role } from '../users/types';
import { userModel } from '../users/models';

const userDAL = new DAL(userModel);

class AuthServices {
  private userRepo: typeof userDAL = new DAL(userModel);
  constructor() {
    this.userRepo = new DAL(userModel);
  }

  public async signupAdmin(payload: IUser) {
    let foundUser = await this.userRepo.findOne({
      email: payload.email,
      phone: payload.phone,
    });
    payload.role = Role.ADMIN;

    if (foundUser) {
      throw new HttpException(400, 'User already exists');
    }

    const salt = await bcryptService.generateSalt(Number(BCRYPT_SALT));
    const hashedPassword = await bcryptService.hashPassword(
      payload.password,
      salt
    );
    payload.password = hashedPassword;

    const userInstance = await this.userRepo.create(payload);

    const savedUser = await this.userRepo.save(userInstance);

    return responseUtils.buildResponse({ data: savedUser });
  }

  public async signupUser(payload: IUser) {
    let foundUser = await this.userRepo.findOne({
      email: payload.email,
      phone: payload.phone,
    });

    if (foundUser) {
      throw new HttpException(400, 'User already exists');
    }

    payload.role = Role.USER;

    const salt = await bcryptService.generateSalt(Number(BCRYPT_SALT));
    const hashedPassword = await bcryptService.hashPassword(
      payload.password,
      salt
    );
    payload.password = hashedPassword;

    const userInstance = await this.userRepo.create(payload);

    const savedUser = await this.userRepo.save(userInstance);

    return responseUtils.buildResponse({ data: savedUser });
  }

  public async loginAdmin(payload: { email: string; password: string }) {
    const foundUser = await this.userRepo.findOne({ email: payload.email });

    if (!foundUser) {
      throw new HttpException(400, 'User not found!');
    }

    if (foundUser.role != Role.ADMIN) {
      throw new HttpException(403, 'Forbidden: Only Admins Allowed');
    }

    const passwordFound = await bcryptService.compare(
      payload.password,
      foundUser.password
    );
    if (!passwordFound) {
      throw new HttpException(400, 'Password Incorrect!');
    }

    return responseUtils.buildResponse({
      message: 'Login Successful',
      data: {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        phone: foundUser.phone,
        token: generateToken(foundUser._id, foundUser.email, foundUser.role),
      },
    });
  }

  public async loginUser(payload: { email: string; password: string }) {
    const foundUser = await this.userRepo.findOne({ email: payload.email });

    if (!foundUser) {
      throw new HttpException(400, 'User not found!');
    }

    if (foundUser.role != Role.USER) {
      throw new HttpException(403, 'Forbidden: Only Users Allowed');
    }

    const passwordFound = await bcryptService.compare(
      payload.password,
      foundUser.password
    );
    if (!passwordFound) {
      throw new HttpException(400, 'Password Incorrect!');
    }

    return responseUtils.buildResponse({
      message: 'Login Successful',
      data: {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        phone: foundUser.phone,
        token: generateToken(foundUser._id, foundUser.email, foundUser.role),
      },
    });
  }
}

export default AuthServices;
