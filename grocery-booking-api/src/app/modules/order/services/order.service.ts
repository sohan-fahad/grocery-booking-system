import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '@src/app/base';
import { SuccessResponse } from '@src/app/types';
import { GroceryItem } from '../../grocery/entities/grocery-item.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDTO, GetOrdersDTO } from '../dtos/create-order.dto';

@Injectable()
export class OrderService extends BaseService<Order> {
    constructor(
        @InjectRepository(Order)
        private readonly _repo: Repository<Order>,
        private readonly dataSource: DataSource,
    ) {
        super(_repo);
    }

    async createOrder(userId: string, payload: CreateOrderDTO): Promise<Order> {
        const savedOrderId = await this.dataSource.transaction(async (manager) => {
            let totalAmount = 0;
            const orderItems: OrderItem[] = [];

            for (const item of payload.items) {
                // Use QueryBuilder so pessimistic lock applies only to grocery_items.
                // findOne() would join eager nullable relations (image, category) and
                // PostgreSQL rejects FOR UPDATE on the nullable side of outer joins.
                const groceryItem = await manager
                    .createQueryBuilder(GroceryItem, 'groceryItem')
                    .setLock('pessimistic_write')
                    .where('groceryItem.id = :id', { id: item.groceryItemId })
                    .getOne();

                if (!groceryItem) {
                    throw new NotFoundException(`Grocery item not found`);
                }

                if (groceryItem.quantity < item.quantity) {
                    throw new BadRequestException(
                        `Insufficient stock for "${groceryItem.name}". Available: ${groceryItem.quantity}`,
                    );
                }

                const unitPrice = Number(groceryItem.price);
                totalAmount += unitPrice * item.quantity;

                const orderItem = manager.create(OrderItem, {
                    groceryItemId: item.groceryItemId,
                    quantity: item.quantity,
                    unitPrice,
                });
                orderItems.push(orderItem);

                await manager.update(GroceryItem, item.groceryItemId, {
                    quantity: groceryItem.quantity - item.quantity,
                });
            }

            const order = manager.create(Order, { userId, totalAmount, items: orderItems });
            const saved = await manager.save(order);
            return saved.id;
        });

        return this._repo.findOne({
            where: { id: savedOrderId },
            relations: ['items', 'items.groceryItem'],
        });
    }

    async getUserOrders(userId: string): Promise<Order[]> {
        return this._repo.find({
            where: { userId },
            relations: ['items', 'items.groceryItem'],
            order: { createdAt: 'DESC' },
        });
    }

    async getUserOrderById(userId: string, orderId: string): Promise<Order> {
        const order = await this._repo.findOne({
            where: { id: orderId, userId },
            relations: ['items', 'items.groceryItem'],
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async getAllOrdersAdmin(filters: GetOrdersDTO): Promise<SuccessResponse> {
        const { page, limit, status, searchTerm } = filters;
        const pRaw = Number(page);
        const lRaw = Number(limit);
        const p = Number.isFinite(pRaw) && pRaw > 0 ? pRaw : 1;
        const l = Number.isFinite(lRaw) && lRaw > 0 ? lRaw : 10;

        const qb = this._repo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.groceryItem', 'groceryItem')
            .orderBy('order.createdAt', 'DESC');

        if (status) {
            qb.andWhere('order.status = :status', { status });
        }
        if (searchTerm?.trim()) {
            const term = `%${searchTerm.trim()}%`;
            qb.andWhere(
                '(user.name ILIKE :term OR user.email ILIKE :term OR CAST(order.id AS text) ILIKE :term)',
                { term },
            );
        }

        qb.skip((p - 1) * l).take(l);
        const [orders, total] = await qb.getManyAndCount();
        return new SuccessResponse('Orders fetched successfully', orders, {
            total,
            page: p,
            limit: l,
        });
    }

    async getOrderByIdAdmin(orderId: string): Promise<Order> {
        const order = await this._repo.findOne({
            where: { id: orderId },
            relations: ['items', 'items.groceryItem', 'user'],
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
