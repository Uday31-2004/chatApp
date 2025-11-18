import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get(':id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() body) {
        return this.usersService.update(id, body);
    }
}
