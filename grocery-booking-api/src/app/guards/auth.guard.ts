import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { JWTHelper } from '../helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JWTHelper) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from headers
    const token = this.jwtHelper.extractToken(request.headers);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = this.jwtHelper.verify(token) as {
        user?: { id: string; role?: string; [k: string]: unknown };
        [k: string]: unknown;
      };

      // Access tokens are issued as { user: { id, ... } } (see web auth login).
      const user = decodedToken.user;
      if (!user?.id) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      (request as any).authUser = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}