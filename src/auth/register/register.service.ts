/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

import { SchemaUser } from 'src/schema/schema';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    
    const res = SchemaUser(user);
    if (res.status >= 400) {
      return new HttpException(
        'Username required email !',
        HttpStatus.CONFLICT,
      );
    }

    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound) {
      return new HttpException('User already exists !', HttpStatus.CONFLICT);
    }

    const { username, password } = user;

    /// CREA HASH PARA EL PASSWORD
    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(password, salt);

    const userCreate = {
      username: username,
      password: newPassword,
    };

    const newUser = this.userRepository.create(userCreate);
    await this.userRepository.save(newUser);

    return { status: 200, message: 'New user created !' };
  }
}
