import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceryItem } from '../grocery/entities/grocery-item.entity';
import { Order } from '../order/entities/order.entity';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [TypeOrmModule.forFeature([GroceryItem, Order])],
    providers: [DashboardService],
    exports: [DashboardService],
})
export class DashboardModule {}
