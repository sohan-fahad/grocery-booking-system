import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDTO {
    @ApiProperty({ type: String, example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({ type: String, example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: String, example: '01838560500', required: false })
    @IsOptional()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    readonly phoneNumber?: string;

    @ApiProperty({ type: String, example: '123456' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
