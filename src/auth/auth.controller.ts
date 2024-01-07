import { Body, Controller, Post, Request } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/modules/user/user.service';
import { Role } from './decorator/role.decorator';
import { ROLE } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // @Role(ROLE.ADMIN)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Role(ROLE.PILOT)
  @Post('log-out')
  async logOut(@Request() req) {
    return this.authService.logOut(req);
  }
}
