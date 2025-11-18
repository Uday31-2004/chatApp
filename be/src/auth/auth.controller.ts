import { Body, Controller, Post, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshStrategy } from './refresh.strategy';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        const value = tokens.refreshToken;
        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: false, // change to true in production
            sameSite: 'lax',
            path: '/auth/refresh',
        });

        return { accessToken: tokens.accessToken };
    }

    @UseGuards(RefreshStrategy)
    @Post('refresh')
    refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.refresh(req.user, res);
    }
}
