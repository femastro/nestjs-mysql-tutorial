import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SchemaUser } from 'src/schema/schema';

@Injectable()
export class UsersService {
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

    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return new HttpException('User not found !', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete({ id });
  }

  async updateUser(id: number, user: UpdateUserDto) {
    return await this.userRepository.update({ id }, user);
  }
}
