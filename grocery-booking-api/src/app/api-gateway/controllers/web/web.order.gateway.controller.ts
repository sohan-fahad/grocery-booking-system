import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/decorators';
import { IAuthUser } from '@src/interfaces';
import { CreateOrderDTO } from '@src/app/modules/order/dtos/create-order.dto';
import { OrderService } from '@src/app/modules/order/services/order.service';
import { SuccessResponse } from '@src/app/types';
import { AuthGuard } from '@src/app/guards/auth.guard';

@ApiTags('Web - Orders')
@ApiBearerAuth()
@Controller('web/orders')
export class WebOrderGatewayController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Place a new order with multiple grocery items' })
    async createOrder(
        @AuthUser() authUser: IAuthUser,
        @Body() body: CreateOrderDTO,
    ) {
        const order = await this.orderService.createOrder(authUser.id, body);
        return new SuccessResponse('Order placed successfully', order);
    }

    @Get('mine')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'View my orders' })
    async getMyOrders(@AuthUser() authUser: IAuthUser) {
        const orders = await this.orderService.getUserOrders(authUser.id);
        return new SuccessResponse('Orders fetched successfully', orders);
    }

    @Get(':id')
    @ApiOperation({ summary: 'View order details' })
    async getOrderById(
        @AuthUser() authUser: IAuthUser,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        const order = await this.orderService.getUserOrderById(authUser.id, id);
        return new SuccessResponse('Order fetched successfully', order);
    }
}
