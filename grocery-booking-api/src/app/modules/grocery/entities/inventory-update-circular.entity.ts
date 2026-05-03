import { BaseEntity } from '@src/app/base';
import { Column, Entity, OneToMany } from 'typeorm';
import { InventoryUpdateCircularItem } from './inventory-update-circular-item.entity';
import { ENUM_TABLE_NAMES } from '@src/shared';

export enum InventoryCircularStatus {
    DRAFTED = 'drafted',
    APPLIED = 'applied',
}

@Entity(ENUM_TABLE_NAMES.INVENTORY_UPDATE_CIRCULARS, { orderBy: { createdAt: 'DESC' } })
export class InventoryUpdateCircular extends BaseEntity {
    public static readonly SEARCH_TERMS: string[] = ['title', 'reason'];

    @Column({ type: 'varchar', length: 256 })
    title: string;

    @Column({ type: 'text', nullable: true })
    reason?: string;

    @Column({ type: 'varchar', length: 64, default: InventoryCircularStatus.DRAFTED })
    status: string;

    @OneToMany(() => InventoryUpdateCircularItem, (e) => e.circular, { cascade: true, eager: true })
    items?: InventoryUpdateCircularItem[];

    constructor() {
        super();
    }
}
