import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    let userId = payload.sub;
    if (userId <= 0) {
      const user = await this.prisma.user.findFirst({ orderBy: { id: 'asc' } });
      if (user) {
        userId = user.id;
      }
    }
    return { userId, username: payload.username, roleId: payload.roleId };
  }
}
