import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum InventoryAction {
    ADD = 'add',
    SUBTRACT = 'subtract',
    SET = 'set',
}

export class ManageInventoryDTO {
    @ApiProperty({ enum: InventoryAction, example: InventoryAction.ADD })
    @IsNotEmpty()
    @IsEnum(InventoryAction)
    action: InventoryAction;

    @ApiProperty({ example: 50, description: 'Quantity to add, subtract, or set' })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    quantity: number;
}
