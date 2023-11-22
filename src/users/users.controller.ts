/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, Patch, Body, ParseIntPipe, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private userSvc: UsersService) {}

    @Get()
    getUsers(): Promise<User[]> {
        return this.userSvc.getUsers();
    }

    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userSvc.getUser(id);
    }

    @Post()
    createUser(@Body() newUser: CreateUserDto){
        return this.userSvc.createUser(newUser)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userSvc.deleteUser(id)
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.userSvc.updateUser(id, user)
    }

}
