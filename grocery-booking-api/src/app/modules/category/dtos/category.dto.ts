import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { BaseDTO } from '@src/app/base';

export class GetCategoryDTO extends BaseDTO {
    @ApiProperty({ example: 'Fruits', required: false })
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiProperty({ example: 10, required: false })
    @IsOptional()
    @IsNumberString()
    limit?: number;
}

export class CreateCategoryDTO {
    @ApiProperty({ example: 'Fruits & Vegetables' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Fresh seasonal fruits and vegetables', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateCategoryDTO {
    @ApiProperty({ example: 'Fruits & Vegetables', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'Fresh seasonal fruits and vegetables', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
