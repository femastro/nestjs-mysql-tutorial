import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
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

    const { username, password, name, lastName } = user;

    /// CREA HASH PARA EL PASSWORD
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    const userCreate = {
      username: username,
      password: newPassword,
      name: name,
      lastName: lastName,
    };

    const newUser = this.userRepository.create(userCreate);
    await this.userRepository.save(newUser);

    return { status: 200, message: 'New user created !' };
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
    const res = await this.userRepository.delete({ id });
    if (res.affected > 0) {
      return { message: 'User Deleted !' };
    }
    return { message: 'Something went wrong !' };
  }

  async updateUser(id: number, user: UpdateUserDto) {
    return await this.userRepository.update({ id }, user);
  }
}
