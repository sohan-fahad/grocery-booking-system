import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { InventoryAction } from './manage-inventory.dto';

export class InventoryUpdateCircularItemDTO {
    @ApiProperty({ example: 'uuid-of-grocery-item' })
    @IsNotEmpty()
    @IsUUID()
    groceryItemId: string;

    @ApiProperty({ enum: InventoryAction, example: InventoryAction.ADD })
    @IsNotEmpty()
    @IsEnum(InventoryAction)
    action: InventoryAction;

    @ApiProperty({ example: 10, description: 'Quantity to add, subtract, or set' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    quantity: number;
}

export class InventoryUpdateCircularDTO {
    @ApiProperty({ example: 'Weekly Restock' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 'Received new supplier shipment on Monday', required: false })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiProperty({ type: [InventoryUpdateCircularItemDTO] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => InventoryUpdateCircularItemDTO)
    items: InventoryUpdateCircularItemDTO[];
}
