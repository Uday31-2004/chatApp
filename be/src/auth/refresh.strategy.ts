import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
    Strategy,
    'refresh',
) {
    constructor() {
        super({
            jwtFromRequest: (req) => req.cookies['refresh_token'],
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req, payload) {
        if (!req.cookies['refresh_token']) {
            throw new UnauthorizedException();
        }
        return payload;
    }
}
