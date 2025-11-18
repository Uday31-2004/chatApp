import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/users.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists) throw new UnauthorizedException('Email already used');

        const hashed = await bcrypt.hash(dto.password, 10);

        const user = new this.userModel({
            name: dto.name,
            email: dto.email,
            password: hashed,
        });

        await user.save();
        return { message: 'User registered successfully' };
    }

    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        return this.generateTokens({ sub: user._id, email: user.email });
    }

    async refresh(user: any, res: any) {
        const tokens = this.generateTokens(user);

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/auth/refresh',
        });

        return { accessToken: tokens.accessToken };
    }

    generateTokens(payload: any) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }
}
