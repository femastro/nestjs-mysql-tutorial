import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('login')
export class LoginController {

    constructor(private authSvc: LoginService){}
    
    @Post()
    login(@Body()user: CreateUserDto) {
        return this.authSvc.login(user);
    }
}
