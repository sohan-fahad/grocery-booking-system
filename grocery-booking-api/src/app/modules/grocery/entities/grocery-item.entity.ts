import { BaseEntity } from '@src/app/base';
import { FileStorage } from '@src/app/modules/file-storage/entities/file-storage.entity';
import { Category } from '@src/app/modules/category/entities/category.entity';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.GROCERY_ITEMS)
export class GroceryItem extends BaseEntity {
    @Column({ type: 'varchar', length: 256 })
    name: string;

    @Column({ type: 'varchar', length: 512, nullable: true })
    description?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column({ type: 'uuid', nullable: true })
    imageId?: string;

    @ManyToOne(() => FileStorage, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'imageId' })
    image?: FileStorage;

    @Column({ type: 'uuid', nullable: true })
    categoryId?: string;

    @ManyToOne(() => Category, (cat) => cat.products, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category?: Category;

    constructor() {
        super();
    }
}
