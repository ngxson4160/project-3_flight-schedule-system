import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/modules/user/user.service';

@Controller('auth')
export class AuthController {
constructor(private readonly userService: UserService){}
    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto){
        return this.userService.create(signUpDto)
    }
}
