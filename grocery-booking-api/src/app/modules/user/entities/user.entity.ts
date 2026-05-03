import { BaseEntity } from '@src/app/base';
import { UserRole } from '@src/shared';
import {
    Entity,
    Column,
    Index,
} from 'typeorm';

@Entity('users')
@Index('users__by_email', ['email'], { unique: true })
export class User extends BaseEntity {

    @Column({ type: 'varchar', length: 256, nullable: true })
    name?: string;

    @Column({ type: 'varchar', length: 256, unique: true })
    email?: string;

    @Column({ type: 'varchar', length: 256, unique: true })
    phoneNumber?: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    picture?: string;


    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({ select: false, nullable: true })
    password?: string;

    constructor() {
        super();
    }
}