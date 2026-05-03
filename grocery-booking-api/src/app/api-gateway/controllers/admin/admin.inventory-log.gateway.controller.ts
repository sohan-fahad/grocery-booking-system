import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/app/decorators/roles.decorator';
import { RolesGuard } from '@src/app/guards/roles.guard';
import { InventoryUpdateCircularDTO } from '@src/app/modules/grocery/dtos/inventory-update-circular.dto';
import { InventoryLogService } from '@src/app/modules/grocery/services/inventory-log.service';
import { SuccessResponse } from '@src/app/types';
import { UserRole } from '@src/shared';

@ApiTags('Admin - Inventory Log')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/inventory')
export class AdminInventoryLogGatewayController {
    constructor(private readonly inventoryLogService: InventoryLogService) {}

    @Post('circular')
    @ApiOperation({ summary: 'Create an inventory update circular and apply stock changes' })
    async createCircular(@Body() body: InventoryUpdateCircularDTO) {
        const circular = await this.inventoryLogService.createCircular(body);
        return new SuccessResponse('Inventory circular created and applied successfully', circular);
    }
}
