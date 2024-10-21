import { IUser, Role } from '../../common/@types/user.types';
import DAL from '../../common/dataAccessLayer';
import userModel from './models/user.model';
import HttpException from '../../common/utilities/exceptions/http.exceptions';
import bcrypt from '../../common/utilities/bcrypt';
import { BCRYPT_SALT } from '../../configs/env.config';
import responseUtils from '../../common/utilities/response.utils';

const userDAL = new DAL(userModel);
const userDALInstance: typeof userDAL = new DAL(userModel);

import { generateToken } from '../../common/utilities/authToken.utils';

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
      return new HttpException(400, 'User already exists');
    }

    const salt = await bcrypt.generateSalt(Number(BCRYPT_SALT));
    const hashedPassword = await bcrypt.hashPassword(payload.password, salt);
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
      return new HttpException(400, 'User already exists');
    }

    payload.role = Role.USER;

    const salt = await bcrypt.generateSalt(Number(BCRYPT_SALT));
    const hashedPassword = await bcrypt.hashPassword(payload.password, salt);
    payload.password = hashedPassword;

    const userInstance = await this.userRepo.create(payload);

    const savedUser = await this.userRepo.save(userInstance);

    return responseUtils.buildResponse({ data: savedUser });
  }

  public async loginAdmin(payload: { email: string; password: string }) {
    const foundUser = await this.userRepo.findOne({ email: payload.email });

    if (!foundUser) {
      return new HttpException(400, 'User not found!');
    }

    if (foundUser.role != Role.ADMIN) {
      return new HttpException(403, 'Forbidden: Only Admins Allowed');
    }

    const passwordFound = await bcrypt.compare(
      payload.password,
      foundUser.password
    );
    if (!passwordFound) {
      return new HttpException(400, 'Password Incorrect!');
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
      return new HttpException(400, 'User not found!');
    }

    if (foundUser.role != Role.USER) {
      return new HttpException(403, 'Forbidden: Only Users Allowed');
    }

    const passwordFound = await bcrypt.compare(
      payload.password,
      foundUser.password
    );
    if (!passwordFound) {
      return new HttpException(400, 'Password Incorrect!');
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
