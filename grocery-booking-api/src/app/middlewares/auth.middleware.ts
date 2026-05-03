import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTHelper } from '../helpers';
import { Request } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtHelper: JWTHelper) { }
  async use(req: Request, _: Response, next: Function) {
    const token = this.jwtHelper.extractToken(req.headers);

    if (!token) {
      throw new UnauthorizedException('Unauthorized Access Detected');
    }

    const verifiedToken: any = await this.jwtHelper.verify(token);

    if (!verifiedToken || !verifiedToken.user) {
      throw new UnauthorizedException('Unauthorized Access Detected');
    }

    req.authUser = verifiedToken.user;

    next();
  }
}
