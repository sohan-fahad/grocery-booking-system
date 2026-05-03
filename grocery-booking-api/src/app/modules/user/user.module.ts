import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { HelpersModule } from '@src/app/helpers/helper.module';

const entities = [User];
const services = [UserService];
const subscribers = [];
const controllers = [];
const webControllers = [];
const modules = [HelpersModule];

@Module({
    imports: [TypeOrmModule.forFeature(entities), ...modules],
    providers: [...services, ...subscribers],
    exports: [...services, ...subscribers],
    controllers: [...controllers, ...webControllers],
})
export class UserModule { }
