import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
    @ApiProperty({ type: String, example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: String, example: '123456' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
