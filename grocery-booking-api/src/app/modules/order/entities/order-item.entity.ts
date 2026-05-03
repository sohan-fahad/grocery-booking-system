import { BaseEntity } from '@src/app/base';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { GroceryItem } from '../../grocery/entities/grocery-item.entity';
import { ENUM_TABLE_NAMES } from '@src/shared';

@Entity(ENUM_TABLE_NAMES.ORDER_ITEMS)
export class OrderItem extends BaseEntity {
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ type: 'uuid' })
    orderId: string;

    @ManyToOne(() => GroceryItem, { eager: true })
    @JoinColumn({ name: 'groceryItemId' })
    groceryItem: GroceryItem;

    @Column({ type: 'uuid' })
    groceryItemId: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    constructor() {
        super();
    }
}
