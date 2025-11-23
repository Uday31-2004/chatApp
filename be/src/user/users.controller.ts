import { Controller, Get, Param, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req: any) {
        // req.user comes from JwtStrategy.validate()
        return this.usersService.findOne(req.user.sub);
    }
    @Get(':id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() body) {
        return this.usersService.update(id, body);
    }
}
