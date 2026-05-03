import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JWTHelper } from '@src/app/helpers';
import { LoginDTO } from '@src/app/modules/user/dtos/login.dto';
import { RegisterDTO } from '@src/app/modules/user/dtos/register.dto';
import { UserService } from '@src/app/modules/user/services/user.service';
import { SuccessResponse } from '@src/app/types';
import { ENV } from '@src/env';

@ApiTags('Auth')
@Controller('web/auth')
export class WebAuthGatewayController {
    constructor(
        private readonly service: UserService,
        private readonly jwtHelper: JWTHelper,
    ) {}

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    async loginUser(@Body() body: LoginDTO) {
        const user = await this.service.loginUser(body);
        const token = this.jwtHelper.makeAccessToken({ user });
        return new SuccessResponse('Login successful', { token, user });
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user account' })
    async registerUser(@Body() body: RegisterDTO) {
        const user = await this.service.registerUser(body);
        return new SuccessResponse('User registered successfully', user);
    }

    @Post('register-admin')
    @ApiOperation({ summary: 'Register an admin account (requires X-Admin-Secret header)' })
    @ApiHeader({ name: 'x-admin-secret', description: 'Admin registration secret key', required: true })
    async registerAdmin(
        @Headers('x-admin-secret') adminSecret: string,
        @Body() body: RegisterDTO,
    ) {
        if (!adminSecret || adminSecret !== ENV.adminSecret) {
            throw new UnauthorizedException('Invalid admin secret');
        }
        const user = await this.service.registerAdmin(body);
        return new SuccessResponse('Admin registered successfully', user);
    }
}
