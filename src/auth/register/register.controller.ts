import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private userSvc: RegisterService) {}

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.userSvc.createUser(newUser);
  }
}
