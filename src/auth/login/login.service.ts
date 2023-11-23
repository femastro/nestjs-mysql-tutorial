/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
    
    constructor(
        @InjectRepository(User) private authRepository:Repository<User>,
    ){}
    
    async login(user: CreateUserDto) {

        try {
            const userLogin = await this.authRepository.findOne(
                {
                    where: {
                        username: user.username,
                    }
                }
            )
            
            const isMatch = await bcrypt.compare(user.password, userLogin.password );
    
            if (!isMatch){
                return new HttpException('User & Password incorrect !', HttpStatus.UNAUTHORIZED)
            }

            delete(userLogin.password);
            return userLogin;

        } catch (e) {
            return ({"status":400,"message":"something went wrong"});
        }

    }

}
