import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { BaseService } from '@src/app/base';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDTO } from '../dtos/register.dto';
import { UserRole } from '@src/shared';
import { LoginDTO } from '../dtos/login.dto';
import { BcryptHelper } from '@src/app/helpers';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        private readonly _repo: Repository<User>,
        private readonly bcrypt: BcryptHelper,
    ) {
        super(_repo);
    }

    async loginUser(payload: LoginDTO): Promise<User> {
        const existUser = await this.findOne({
            where: { email: payload.email },
            select: ['id', 'name', 'email', 'phoneNumber', 'role', 'password'],
        });

        if (!existUser) throw new NotFoundException('User not found');

        const isMatch = await this.bcrypt.compareHash(payload.password, existUser.password);
        if (!isMatch) throw new BadRequestException('Invalid credentials');

        delete existUser.password;
        return existUser;
    }

    async registerUser(payload: RegisterDTO): Promise<User> {
        const existing = await this.findOne({ where: { email: payload.email } });
        if (existing) throw new ConflictException('User already exists');

        const hashedPassword = await this.bcrypt.hash(payload.password);
        const user = await this.createOneBase({
            ...payload,
            role: UserRole.USER,
            password: hashedPassword,
        } as any);

        delete user.password;
        return user;
    }

    async registerAdmin(payload: RegisterDTO): Promise<User> {
        const existing = await this.findOne({ where: { email: payload.email } });
        if (existing) throw new ConflictException('User already exists');

        const hashedPassword = await this.bcrypt.hash(payload.password);
        const user = await this.createOneBase({
            ...payload,
            role: UserRole.ADMIN,
            password: hashedPassword,
        } as any);

        delete user.password;
        return user;
    }
}
