import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, OneToMany } from 'typeorm';
import { GroceryItem } from '../../grocery/entities/grocery-item.entity';

@Entity(ENUM_TABLE_NAMES.CATEGORIES)
export class Category extends BaseEntity {
    @Column({ type: 'varchar', length: 256 })
    name: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    description?: string;

    @OneToMany(() => GroceryItem, (item) => item.category, { eager: false })
    products?: GroceryItem[];

    constructor() {
        super();
    }
}
