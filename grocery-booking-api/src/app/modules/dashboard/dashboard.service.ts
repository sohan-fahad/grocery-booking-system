import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { GroceryItem } from '../grocery/entities/grocery-item.entity';
import { Order } from '../order/entities/order.entity';

const LOW_STOCK_THRESHOLD = 10;

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(GroceryItem)
        private readonly groceryItemRepo: Repository<GroceryItem>,
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
    ) {}

    async getStats() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - 7);
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - 14);

        const [totalItems, newItemsThisWeek, totalOrders, ordersToday] = await Promise.all([
            this.groceryItemRepo.count({ where: { isActive: true } }),
            this.groceryItemRepo.count({ where: { isActive: true, createdAt: MoreThan(thisWeekStart) } }),
            this.orderRepo.count(),
            this.orderRepo.count({ where: { createdAt: MoreThan(todayStart) } }),
        ]);

        const [revenueResult, revenueThisWeekResult, revenueLastWeekResult] = await Promise.all([
            this.orderRepo
                .createQueryBuilder('o')
                .select('COALESCE(SUM(o.totalAmount), 0)', 'total')
                .getRawOne<{ total: string }>(),
            this.orderRepo
                .createQueryBuilder('o')
                .select('COALESCE(SUM(o.totalAmount), 0)', 'total')
                .where('o.createdAt >= :start', { start: thisWeekStart })
                .getRawOne<{ total: string }>(),
            this.orderRepo
                .createQueryBuilder('o')
                .select('COALESCE(SUM(o.totalAmount), 0)', 'total')
                .where('o.createdAt >= :start AND o.createdAt < :end', { start: lastWeekStart, end: thisWeekStart })
                .getRawOne<{ total: string }>(),
        ]);

        const totalRevenue = parseFloat(revenueResult?.total ?? '0');
        const revenueThisWeek = parseFloat(revenueThisWeekResult?.total ?? '0');
        const revenueLastWeek = parseFloat(revenueLastWeekResult?.total ?? '0');
        const revenueChangePercent =
            revenueLastWeek > 0
                ? Math.round(((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100)
                : 0;

        const lowStockItems = await this.groceryItemRepo.find({
            where: { isActive: true, quantity: LessThanOrEqual(LOW_STOCK_THRESHOLD) },
            order: { quantity: 'ASC' },
            relations: ['image'],
        });

        const recentOrders = await this.orderRepo.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: 5,
        });

        const recentOrdersWithMeta = await Promise.all(
            recentOrders.map(async (order, idx) => {
                const previousCount = await this.orderRepo.count({
                    where: { userId: order.userId, createdAt: LessThan(order.createdAt) },
                });
                return {
                    id: order.id,
                    orderNumber: `ORD${String(totalOrders - idx).padStart(3, '0')}`,
                    customerName: order.user?.name ?? order.user?.email ?? 'Unknown',
                    totalAmount: Number(order.totalAmount),
                    isFirstOrder: previousCount === 0,
                };
            }),
        );

        return {
            totalItems,
            newItemsThisWeek,
            totalOrders,
            ordersToday,
            totalRevenue,
            revenueChangePercent,
            lowStockCount: lowStockItems.length,
            lowStockItems: lowStockItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: Number(item.quantity),
                imageUrl: item.image?.link ?? null,
            })),
            recentOrders: recentOrdersWithMeta,
        };
    }
}
