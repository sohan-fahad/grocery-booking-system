import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDTO } from '@src/app/base';


export class GetGroceryItemDTO extends BaseDTO {
    @ApiProperty({ example: 'Organic Apples', required: false })
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @ApiProperty({ example: 1, required: true })
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiProperty({ example: 10, required: true })
    @IsOptional()
    @IsNumberString()
    limit?: number;

    @ApiProperty({ example: 'uuid-of-category', required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;
}

export class CreateGroceryItemDTO {
    @ApiProperty({ example: 'Organic Apples', description: 'Name of the grocery item' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Fresh organic apples', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 2.99, description: 'Price per unit' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: 100, description: 'Initial stock quantity' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty({ example: 'uuid-of-image', required: false })
    @IsOptional()
    @IsUUID()
    imageId?: string;

    @ApiProperty({ example: 'uuid-of-category', required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;
}


export class UpdateGroceryItemDTO {
    @ApiProperty({ example: 'Organic Apples', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'Fresh organic apples', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 2.99, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiProperty({ example: 'uuid-of-image', required: false })
    @IsOptional()
    @IsUUID()
    imageId?: string;

    @ApiProperty({ example: 'uuid-of-category', required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;
}
