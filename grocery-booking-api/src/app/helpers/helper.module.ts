import { Module } from "@nestjs/common";
import { BcryptHelper } from "./bcrypt.helper";
import { JWTHelper } from "./jwt.helper";

const HELPERS = [BcryptHelper, JWTHelper];

@Module({
    providers: [...HELPERS],
    exports: [...HELPERS],
})
export class HelpersModule { }
