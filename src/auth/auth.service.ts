import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageResponse } from 'src/common/constants/message-response.constant';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(
      password,
      parseInt(this.configService.get('AUTH_SALT_ROUND')),
    );
  }

  async comparePassword(
    inputPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, userPassword);
  }

  async createToken(
    payload: any,
    privateKey: string,
    tokenLife: string,
  ): Promise<string> {
    return sign({ data: payload }, privateKey, { expiresIn: tokenLife });
  }

  async verifyToken(token: string, privateKey: string) {
    return verify(token, privateKey);
  }

  async signUp(data: Prisma.UserCreateInput): Promise<User> {
    const userFound = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userFound) {
      throw new BadRequestException(MessageResponse.USER.EXIST);
    }

    const password = data.password;
    const passwordHash = await this.hashPassword(password);
    return await this.prisma.user.create({
      data: {
        ...data,
        password: passwordHash,
      },
    });
  }

  async signIn(data: LoginDto) {
    const userFound = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!userFound) {
      throw new BadRequestException(MessageResponse.AUTH.WRONG_ACCOUNT);
    }

    const isMatchPassword = await this.comparePassword(
      data.password,
      userFound.password,
    );

    if (isMatchPassword) {
      const payload = {
        id: userFound.id,
        email: userFound.email,
        role: userFound.role,
      };
      const accessToken = await this.createToken(
        payload,
        this.configService.get('ACCESS_TOKEN_SECRET'),
        '1d',
      );
      const refreshToken = await this.createToken(
        payload,
        this.configService.get('REFRESH_TOKEN_SECRET'),
        '30d',
      );
      const updateToken = { accessToken, refreshToken };
      await this.prisma.user.update({
        where: { email: data.email },
        data: updateToken,
      });
      return {
        message: 'success',
        accessToken,
        refreshToken,
      };
    } else {
      throw new BadRequestException(MessageResponse.AUTH.WRONG_ACCOUNT);
    }
  }

  async logOut(req: any) {
    const userInfo = req.user.data;

    const userFound = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!userFound) {
      throw new InternalServerErrorException();
    }

    await this.prisma.user.update({
      where: { email: userInfo.email },
      data: { accessToken: '', refreshToken: '' },
    });

    return {
      message: MessageResponse.AUTH.LOG_OUT_SUCCESS,
    };
  }

  async getProfile(userEmail: string) {
    const userFound = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!userFound) {
      throw new BadRequestException(MessageResponse.USER.NOT_EXIST);
    }
    delete userFound.password;
    delete userFound.accessToken;
    delete userFound.refreshToken;

    return {
      message: MessageResponse.USER.GET_PROFILE_SUCCESS,
      data: userFound,
    };
  }
}
