import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/app/decorators/roles.decorator';
import { RolesGuard } from '@src/app/guards/roles.guard';
import { GetOrdersDTO } from '@src/app/modules/order/dtos/create-order.dto';
import { OrderService } from '@src/app/modules/order/services/order.service';
import { SuccessResponse } from '@src/app/types';
import { UserRole } from '@src/shared';

@ApiTags('Admin - Orders')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/orders')
export class AdminOrderGatewayController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @ApiOperation({ summary: 'List all customer orders' })
    async listOrders(@Query() query: GetOrdersDTO) {
        return this.orderService.getAllOrdersAdmin(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details by id' })
    async getOrder(@Param('id', ParseUUIDPipe) id: string) {
        const order = await this.orderService.getOrderByIdAdmin(id);
        return new SuccessResponse('Order fetched successfully', order);
    }
}
