import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(user: CreateUserDto) {
    try {
      const userLogin = await this.authRepository.findOne({
        where: {
          username: user.username,
        },
      });

      const isMatch = await bcrypt.compare(user.password, userLogin.password);

      if (!isMatch) {
        return new HttpException(
          'User & Password incorrect !',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = { sub: userLogin.password, username: userLogin.username };

      return this.jwtService.signAsync(payload);
    } catch (e) {
      return { Error: e, status: 400, message: 'something went wrong' };
    }
  }
}
