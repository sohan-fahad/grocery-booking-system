import { BaseEntity } from '@src/app/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { ENUM_TABLE_NAMES } from '@src/shared';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity(ENUM_TABLE_NAMES.ORDERS)
export class Order extends BaseEntity {
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid' })
    userId: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
    items: OrderItem[];

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    constructor() {
        super();
    }
}
