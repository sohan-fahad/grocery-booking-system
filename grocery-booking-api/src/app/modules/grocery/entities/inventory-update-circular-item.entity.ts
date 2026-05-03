import { BaseEntity } from '@src/app/base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GroceryItem } from './grocery-item.entity';
import { InventoryUpdateCircular } from './inventory-update-circular.entity';
import { InventoryAction } from '../dtos/manage-inventory.dto';
import { ENUM_TABLE_NAMES } from '@src/shared';

@Entity(ENUM_TABLE_NAMES.INVENTORY_UPDATE_CIRCULAR_ITEMS)
export class InventoryUpdateCircularItem extends BaseEntity {
    @ManyToOne(() => InventoryUpdateCircular, (e) => e.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'circularId' })
    circular: InventoryUpdateCircular;

    @Column({ type: 'uuid' })
    circularId: string;

    @ManyToOne(() => GroceryItem, { eager: true, nullable: false })
    @JoinColumn({ name: 'groceryItemId' })
    groceryItem: GroceryItem;

    @Column({ type: 'uuid' })
    groceryItemId: string;

    @Column({ type: 'int' })
    previousQuantity: number;

    @Column({ type: 'int' })
    newQuantity: number;

    @Column({ type: 'int' })
    quantityChanged: number;

    @Column({ type: 'varchar', length: 32 })
    action: InventoryAction;

    constructor() {
        super();
    }
}
