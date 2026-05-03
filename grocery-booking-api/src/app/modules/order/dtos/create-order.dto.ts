import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';

export class OrderItemDTO {
    @ApiProperty({ example: 'uuid-of-grocery-item' })
    @IsNotEmpty()
    @IsUUID()
    groceryItemId: string;

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDTO {
    @ApiProperty({ type: [OrderItemDTO], description: 'List of items to order' })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDTO)
    items: OrderItemDTO[];
}

export class GetOrdersDTO {
    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiProperty({ example: 10, required: false })
    @IsOptional()
    @IsNumberString()
    limit?: number;

    @ApiProperty({ example: 'pending', required: false })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty({ example: 'jane@example.com', required: false })
    @IsOptional()
    @IsString()
    searchTerm?: string;
}
